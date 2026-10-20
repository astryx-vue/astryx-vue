import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { runStatus } from '../scripts/swarm/status.mjs'
import { planSet } from '../scripts/swarm/status/edit.mjs'
import { buildGraph, checkRoadmap, downstreamCounts, readyNodes } from '../scripts/swarm/status/model.mjs'
import { expandDeps, parseRoadmap, RoadmapParseError, splitRow } from '../scripts/swarm/status/roadmap.mjs'
import { isAllowedTransition, resolveState, stateByKey } from '../scripts/swarm/status/states.mjs'

const FIXTURE = readFileSync(join(import.meta.dirname, 'fixtures/swarm-roadmap.md'), 'utf8')

/** 把某一行里的 from 换成 to，找不到时让测试直接失败。 */
function replaceLine(text: string, match: string, from: string, to: string) {
  const lines = text.split('\n')
  const index = lines.findIndex(line => line.includes(match))
  expect(index, `找不到包含 ${match} 的行`).toBeGreaterThanOrEqual(0)
  lines[index] = lines[index].replace(from, to)
  return lines.join('\n')
}

function changedLines(before: string, after: string) {
  const a = before.split('\n')
  const b = after.split('\n')
  expect(b.length).toBe(a.length)
  return a.flatMap((line, i) => (line === b[i] ? [] : [{ before: line, after: b[i] }]))
}

function messages(text: string) {
  return checkRoadmap(parseRoadmap(text)).map(p => `${p.id}：${p.message}`)
}

describe('状态名', () => {
  it('中文、英文简写、别名、emoji 和总表写法都能认出同一个状态', () => {
    const verifying = stateByKey('verifying')
    for (const input of ['验收中', 'verifying', 'verify', '🔷', '🔷 验收中', ' VERIFYING '])
      expect(resolveState(input)).toBe(verifying)
    expect(resolveState('✅')).toBe(resolveState('done'))
    expect(resolveState('✅\uFE0F')).toBe(resolveState('done'))
    expect(resolveState('差不多了')).toBeUndefined()
  })

  it('流转规则跟着生命周期图走', () => {
    const s = (key: string) => stateByKey(key)
    expect(isAllowedTransition(s('implementing'), s('awaiting-verify'))).toBe(true)
    expect(isAllowedTransition(s('implementing'), s('done'))).toBe(false)
    expect(isAllowedTransition(s('verifying'), s('rework'))).toBe(true)
    expect(isAllowedTransition(s('rework'), s('needs-user'))).toBe(true)
    expect(isAllowedTransition(s('ready'), s('skipped'))).toBe(true)
    expect(isAllowedTransition(s('done'), s('skipped'))).toBe(false)
    expect(isAllowedTransition(s('done'), s('done'))).toBe(true)
  })
})

describe('解析', () => {
  it('读出 mindmap 和总表两块，节点、阶段、行号都对', () => {
    const roadmap = parseRoadmap(FIXTURE)
    expect(roadmap.phases.map(p => p.letter)).toEqual(['A', 'B', 'C', 'D', 'F'])
    expect(roadmap.mindmap.map(n => n.id)).toEqual(roadmap.table.map(r => r.id))
    const a4 = roadmap.mindmap.find(n => n.id === 'A4')!
    expect(a4).toMatchObject({ emoji: '🟡', name: '蜂群基础设施', phase: 'A' })
    expect(roadmap.lines[a4.line]).toBe('      🟡 A4 蜂群基础设施')
    const row = roadmap.table.find(r => r.id === 'A4')!
    expect(row).toMatchObject({ deps: 'A1', state: '🟡 实现中', round: '1', impl: 'A4-impl', verify: '', result: '', pr: '' })
  })

  it('表格按没有转义的竖线切分', () => {
    expect(splitRow('| a | b \\| c | |')).toEqual(['a', 'b \\| c', ''])
    expect(splitRow('不是表格')).toBeNull()
  })

  it('格式不对时抛 RoadmapParseError', () => {
    expect(() => parseRoadmap(FIXTURE.replace('## 当前状态总表', '## 别的表'))).toThrow(RoadmapParseError)
    expect(() => parseRoadmap(FIXTURE.replace('| 节点 | 名称 | 依赖 |', '| 节点 | 依赖 | 名称 |'))).toThrow(/表头/)
    expect(() => parseRoadmap(replaceLine(FIXTURE, '| B4 |', '| 0 |', '| 0 | 多一列 |'))).toThrow(/10 列/)
    expect(() => parseRoadmap(replaceLine(FIXTURE, '⬜ B4 浮层运行时', '⬜ B4 浮层运行时', '这是什么'))).toThrow(/看不懂/)
  })
})

describe('依赖简写展开', () => {
  const ids = ['A1', 'C1', 'C2', 'C10', 'F3a', 'F3b', 'F3c', 'F3d', 'F3e', 'F3f', 'G1']

  it('「C全部」展开成所有 C 节点', () => {
    expect(expandDeps('C全部 G1', ids)).toEqual({ ids: ['C1', 'C2', 'C10', 'G1'], unknown: [] })
  })

  it('字母区间和数字区间，两种连字符都认', () => {
    expect(expandDeps('F3a–F3e', ids).ids).toEqual(['F3a', 'F3b', 'F3c', 'F3d', 'F3e'])
    expect(expandDeps('F3a-F3c', ids).ids).toEqual(['F3a', 'F3b', 'F3c'])
    expect(expandDeps('C1-C2', ids).ids).toEqual(['C1', 'C2'])
  })

  it('「—」表示没有依赖；重复的只留一个；不存在的进 unknown', () => {
    expect(expandDeps('—', ids)).toEqual({ ids: [], unknown: [] })
    expect(expandDeps('C1 C全部', ids).ids).toEqual(['C1', 'C2', 'C10'])
    expect(expandDeps('Z9 D全部 C1-C3', ids).unknown).toEqual(['Z9', 'D全部', 'C1-C3（其中 C3 不存在）'])
  })

  it('样本里 F3f 的「F3a–F3c」和 D7 的「C全部」在图里展开正确', () => {
    const nodes = buildGraph(parseRoadmap(FIXTURE))
    expect(nodes.get('F3f')!.deps).toEqual(['F3a', 'F3b', 'F3c'])
    expect(nodes.get('D7')!.deps).toEqual(['C1', 'C2'])
  })
})

describe('check', () => {
  it('样本本身是一致的', () => {
    expect(messages(FIXTURE)).toEqual([])
  })

  it('发现 emoji 和总表状态不一致', () => {
    const text = replaceLine(FIXTURE, '⬜ B1 主题系统', '⬜', '🔵')
    expect(messages(text)).toContainEqual('B1：进度树状图是 🔵 可开工，总表是 ⬜ 未开始')
  })

  it('发现只在一边出现的节点和重复节点', () => {
    const onlyMind = FIXTURE.replace('      ⬜ C2 勾选与开关\n', '      ⬜ C2 勾选与开关\n      ⬜ C9 只在图里\n')
    expect(messages(onlyMind)).toContainEqual('C9：只出现在进度树状图里，总表没有这一行')
    const onlyTable = FIXTURE.replace('      ⬜ C2 勾选与开关\n', '')
    expect(messages(onlyTable)).toContainEqual('C2：只出现在总表里，进度树状图没有这个节点')
    const twice = FIXTURE.replace('| C2 | 勾选与开关 | B3 | ⬜ 未开始 | 0 | | | | |\n', '| C2 | 勾选与开关 | B3 | ⬜ 未开始 | 0 | | | | |\n| C2 | 勾选与开关 | B3 | ⬜ 未开始 | 0 | | | | |\n')
    expect(messages(twice)).toContainEqual('C2：在总表里出现了不止一次')
  })

  it('发现不存在的依赖和看不懂的状态', () => {
    expect(messages(replaceLine(FIXTURE, '| B4 |', '| B3 |', '| B3 Z9 |'))).toContainEqual('B4：依赖「Z9」不存在')
    expect(messages(replaceLine(FIXTURE, '| B4 |', '⬜ 未开始', '⬜ 快好了'))).toContainEqual('B4：总表状态「⬜ 快好了」不是图例里的写法')
    expect(messages(replaceLine(FIXTURE, '| B4 |', '⬜ 未开始', '🔵 未开始'))).toContainEqual('B4：总表状态「🔵 未开始」不是图例里的写法')
  })

  it('发现依赖没完成却已经开工的节点', () => {
    let text = replaceLine(FIXTURE, '⬜ B1 主题系统', '⬜', '🟡')
    text = replaceLine(text, '| B1 |', '⬜ 未开始', '🟡 实现中')
    expect(messages(text)).toEqual(['B1：已经是「实现中」，但依赖 A4（实现中）还没完成'])
  })

  it('发现依赖成环', () => {
    const text = replaceLine(FIXTURE, '| A4 |', '| A1 |', '| A1 B1 |')
    expect(messages(text).some(m => m.includes('依赖成环') && m.includes('A4 → B1 → A4'))).toBe(true)
  })
})

describe('ready', () => {
  it('下游数量算的是全部直接和间接下游', () => {
    const counts = downstreamCounts(buildGraph(parseRoadmap(FIXTURE)))
    expect(counts.get('B3')).toBe(7) // B4 C1 C2 D7 F3a F3c F3f
    expect(counts.get('F0')).toBe(4)
    expect(counts.get('D4a')).toBe(0)
  })

  it('等待派发的按下游数量从多到少排，相同按总表顺序', () => {
    expect(readyNodes(parseRoadmap(FIXTURE))).toEqual({
      unlockable: [],
      queued: [
        { id: 'F0', name: '选型', downstream: 4 },
        { id: 'D4a', name: 'CLI 对照', downstream: 0 },
      ],
    })
  })

  it('列出依赖已全部完成但还标着未开始的节点', () => {
    let text = replaceLine(FIXTURE, '🟡 A4 蜂群基础设施', '🟡', '✅')
    text = replaceLine(text, '| A4 |', '🟡 实现中', '✅ 已完成')
    expect(readyNodes(parseRoadmap(text)).unlockable.map(item => item.id)).toEqual(['B3', 'B1'])
  })
})

describe('set', () => {
  it('同时改 emoji 和总表那一行，其它字节不变', () => {
    const plan = planSet(FIXTURE, { id: 'A4', state: stateByKey('awaiting-verify'), fields: { result: '自测通过', pr: 'abc1234' } })
    expect(changedLines(FIXTURE, plan.text)).toEqual([
      { before: '      🟡 A4 蜂群基础设施', after: '      🟣 A4 蜂群基础设施' },
      { before: '| A4 | 蜂群基础设施 | A1 | 🟡 实现中 | 1 | A4-impl | | | |', after: '| A4 | 蜂群基础设施 | A1 | 🟣 待验收 | 1 | A4-impl | | 自测通过 | abc1234 |' },
    ])
    expect(plan.unlocked).toEqual([])
    expect(plan.text).toContain('| A4 蜂群基础设施 | 🟡 这一行不是总表')
  })

  it('只改字段不改状态也可以；空字符串会清空字段', () => {
    const plan = planSet(FIXTURE, { id: 'A4', state: stateByKey('implementing'), fields: { round: '2', impl: 'A4-impl-r2', result: '' } })
    expect(changedLines(FIXTURE, plan.text)).toEqual([
      { before: '| A4 | 蜂群基础设施 | A1 | 🟡 实现中 | 1 | A4-impl | | | |', after: '| A4 | 蜂群基础设施 | A1 | 🟡 实现中 | 2 | A4-impl-r2 | | | |' },
    ])
  })

  it('完成后自动把依赖已全部完成的下游改成可开工，依赖没齐的不动', () => {
    const verifying = planSet(FIXTURE, { id: 'A4', state: stateByKey('verifying'), force: true }).text
    const plan = planSet(verifying, { id: 'A4', state: stateByKey('done'), fields: { verify: 'A4-verify', result: '通过' } })
    expect(plan.unlocked).toEqual(['B1', 'B3'])
    const diff = changedLines(verifying, plan.text)
    expect(diff.map(d => d.after)).toEqual([
      '      ✅ A4 蜂群基础设施',
      '      🔵 B1 主题系统',
      '      🔵 B3 交互函数',
      '| A4 | 蜂群基础设施 | A1 | ✅ 已完成 | 1 | A4-impl | A4-verify | 通过 | |',
      '| B1 | 主题系统 | A4 | 🔵 可开工 | 0 | | | | |',
      '| B3 | 交互函数 | A4 | 🔵 可开工 | 0 | | | | |',
    ])
    expect(messages(plan.text)).toEqual([])
  })

  it('「不做」也算依赖结束，会解锁下游', () => {
    const plan = planSet(FIXTURE, { id: 'F0', state: stateByKey('skipped') })
    expect(plan.unlocked).toEqual(['F3b'])
  })

  it('不合规的流转和依赖没完成的开工会被拒绝，--force 可以放行流转', () => {
    expect(() => planSet(FIXTURE, { id: 'A4', state: stateByKey('done') })).toThrow(/不能从「实现中」直接改成「已完成」/)
    expect(() => planSet(FIXTURE, { id: 'B1', state: stateByKey('ready') })).toThrow(/依赖 A4 还没完成/)
    expect(() => planSet(FIXTURE, { id: 'Z9', state: stateByKey('ready') })).toThrow(/没有节点 Z9/)
    expect(planSet(FIXTURE, { id: 'A4', state: stateByKey('done'), force: true }).unlocked).toEqual(['B1', 'B3'])
  })

  it('单元格里的竖线会转义，换行会被拒绝', () => {
    const plan = planSet(FIXTURE, { id: 'A4', state: stateByKey('implementing'), fields: { result: 'a | b' } })
    expect(plan.text).toContain('| A4-impl | | a \\| b | |')
    expect(parseRoadmap(plan.text).table.find(r => r.id === 'A4')!.result).toBe('a \\| b')
    expect(() => planSet(FIXTURE, { id: 'A4', state: stateByKey('implementing'), fields: { result: 'a\nb' } })).toThrow(/换行/)
  })

  it('保留 CRLF 换行', () => {
    const crlf = FIXTURE.replace(/\n/g, '\r\n')
    const plan = planSet(crlf, { id: 'A4', state: stateByKey('awaiting-verify') })
    expect(plan.text).toBe(planSet(FIXTURE, { id: 'A4', state: stateByKey('awaiting-verify') }).text.replace(/\n/g, '\r\n'))
  })
})

describe('命令行', () => {
  let dir: string
  let file: string
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'swarm-status-'))
    file = join(dir, 'ROADMAP.md')
    writeFileSync(file, FIXTURE)
  })
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('check 一致时退出码 0，不一致时 1 并列出问题', () => {
    expect(runStatus(['check', '--file', file]).code).toBe(0)
    writeFileSync(file, replaceLine(FIXTURE, '⬜ B1 主题系统', '⬜', '✅'))
    const result = runStatus(['check', '--file', file])
    expect(result.code).toBe(1)
    expect(result.stderr).toContain('B1：进度树状图是 ✅ 已完成')
  })

  it('set 写盘，中文和英文状态名都接受；--dry-run 不写', () => {
    expect(runStatus(['set', 'A4', 'to-verify', '--file', file, '--dry-run']).stdout).toContain('将要把 A4 改成「待验收」')
    expect(readFileSync(file, 'utf8')).toBe(FIXTURE)
    const done = runStatus(['set', 'A4', '待验收', '--file', file, '--round', '1'])
    expect(done.code).toBe(0)
    expect(readFileSync(file, 'utf8')).toContain('| A4 | 蜂群基础设施 | A1 | 🟣 待验收 |')
    expect(runStatus(['check', '--file', file]).code).toBe(0)
  })

  it('参数错误退出码 2，被拒绝退出码 1，文件不变', () => {
    expect(runStatus(['set', 'A4', '差不多了', '--file', file]).code).toBe(2)
    expect(runStatus(['set', 'A4', '--file', file]).code).toBe(2)
    expect(runStatus(['set', 'A4', 'done', '--round', 'x', '--file', file]).code).toBe(2)
    expect(runStatus(['frobnicate']).code).toBe(2)
    expect(runStatus(['set', 'A4', 'done', '--file', file]).code).toBe(1)
    expect(readFileSync(file, 'utf8')).toBe(FIXTURE)
  })

  it('show 按阶段分组，每个节点一行', () => {
    const { stdout } = runStatus(['show', '--file', file])
    expect(stdout).toMatch(/^阶段 A 准备工作\n {2}✅ A1 {3}上游差异台账 {2}\[已完成\]/)
    expect(stdout).toContain('  🟡 A4   蜂群基础设施  [实现中]  第 1 轮 · 实现 A4-impl')
    expect(stdout).toContain('合计：实现中 1，可开工 2，未开始 10，已完成 1')
  })
})

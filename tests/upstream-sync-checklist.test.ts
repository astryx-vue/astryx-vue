import { describe, expect, it } from 'vitest'
import { applyResults, familyProgress, parseChecklist, parseResults } from '../scripts/upstream-sync/checklist.mjs'
import { triageFiles } from '../scripts/upstream-sync/triage-rules.mjs'

const CHECKLIST = [
  '# 上游待同步清单',
  '',
  '## 按钮（area:core）',
  '',
  '- [ ] [`aaaaaaaaa`](https://github.com/meta/astryx/commit/aaaaaaaaa) fix(Button): one',
  '- [x] [`bbbbbbbbb`](https://github.com/meta/astryx/commit/bbbbbbbbb) fix(Button): two',
  '  - Vue 版已有：Button.vue',
  '',
  '## 浮层（area:core）',
  '',
  '- [ ] [`aaaaaaaaa`](https://github.com/meta/astryx/commit/aaaaaaaaa) fix(Button): one',
  '',
].join('\n')

describe('parseResults', () => {
  it('reads hash, status and note, and reports lines it cannot read', () => {
    const { results, problems } = parseResults('aaaaaaaaa | 已移植 #12 | 补上测试\n# 注释\n\nbbbbbbbbb | 随便 | x')
    expect(results).toEqual([{ hash: 'aaaaaaaaa', status: '已移植 #12', kind: '已移植', note: '补上测试' }])
    expect(problems).toEqual(['第 4 行看不懂：bbbbbbbbb | 随便 | x'])
  })
})

describe('applyResults', () => {
  it('ticks the hash in every family and links the PR', () => {
    const { markdown, hits } = applyResults(CHECKLIST, parseResults('aaaaaaaaa | 已移植 #12 | 补上测试').results)
    expect(hits.get('aaaaaaaaa')).toBe(2)
    const note = 'fix(Button): one\n  - 已移植：[#12](https://github.com/astryx-vue/astryx-vue/pull/12)。补上测试\n'
    expect(markdown.split(note)).toHaveLength(3)
    expect(familyProgress(markdown).map(item => item.open)).toEqual([0, 0])
  })

  it('limits ticks to one family when asked', () => {
    const { markdown } = applyResults(CHECKLIST, parseResults('aaaaaaaaa | 不适用 | 只关系 React').results, { family: '浮层' })
    expect(familyProgress(markdown)).toEqual([
      { heading: '## 按钮（area:core）', done: 1, open: 1 },
      { heading: '## 浮层（area:core）', done: 1, open: 0 },
    ])
  })

  it('adds a note without ticking a deferred item and leaves ticked items alone', () => {
    const { markdown } = applyResults(CHECKLIST, parseResults('aaaaaaaaa | 暂缓 | 缺浮层设施\nbbbbbbbbb | 不适用 | x').results, { family: '按钮' })
    const entries = parseChecklist(markdown).entries
    expect(entries[0]).toMatchObject({ checked: false })
    expect(markdown).toContain('fix(Button): one\n  - 暂缓：缺浮层设施')
    expect(markdown.match(/不适用：x/g)).toBeNull()
  })
})

describe('triageFiles', () => {
  it('accepts a change that only touches upstream-only files', () => {
    expect(triageFiles(['docs/specs/components/Dialog.spec.md', 'packages/core/src/Dialog/Dialog.test.tsx'])).toEqual(['上游内部规范和架构文档', '只改上游测试'])
  })

  it('rejects a change with any source, docs site or locale file', () => {
    expect(triageFiles(['packages/core/src/Dialog/Dialog.tsx', '.changeset/a.md'])).toBeNull()
    expect(triageFiles(['packages/core/locales/en.json'])).toBeNull()
    expect(triageFiles([])).toBeNull()
  })
})

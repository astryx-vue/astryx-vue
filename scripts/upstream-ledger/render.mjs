// 把归好类的提交渲染成 Markdown 台账。输出只取决于输入，不含时间戳等易变内容。

import { compareText, sortNodes } from './commits.mjs'
import { NODES, RULES } from './rules.mjs'

export const UPSTREAM_COMMIT_URL = 'https://github.com/facebook/astryx/commit/'

/** 「新功能 / 修复 / 其它」下的小节，顺序固定。不在列表里的类型都进「其它」。 */
const TYPE_SECTIONS = ['feat', 'fix', 'perf', 'refactor', 'test', 'docs']
const MAX_LISTED_FILES = 8

/** 台账里显示的文件路径：core 源码去掉 packages/core/src/ 前缀，其它保留完整路径。 */
export function displayPath(file) {
  return file.startsWith('packages/core/src/') ? file.slice('packages/core/src/'.length) : file
}

function listFiles(files) {
  const shown = files.slice(0, MAX_LISTED_FILES).map(displayPath).join('、')
  return files.length > MAX_LISTED_FILES ? `${shown} 等 ${files.length} 个` : shown
}

/** 规范文档：组件规范 .spec.md 和文档元数据 .doc.mjs（含 .doc.zh.mjs 等变体）。 */
export function isSpecDoc(file) {
  return /\.spec\.md$/.test(file) || /\.doc(?:\.[a-z]+)?\.mjs$/.test(file)
}

/** 测试文件：*.test.* 、*.spec.ts(x) 和 __tests__ 目录下的文件。 */
export function isTestFile(file) {
  return /\.test\.[cm]?[jt]sx?$/.test(file) || /\.spec\.[cm]?[jt]sx?$/.test(file) || file.includes('/__tests__/')
}

function shortHash(hash) {
  return hash.slice(0, 9)
}

function renderNodeEntry(commit, node) {
  const files = commit.nodes.get(node)
  const lines = [`- [ ] \`${shortHash(commit.hash)}\` ${commit.subject}`]
  lines.push(`  - 文件：${listFiles(files)}`)
  const specs = files.filter(isSpecDoc)
  if (specs.length > 0)
    lines.push(`  - 规范文档：${specs.map(displayPath).join('、')}`)
  const tests = files.filter(isTestFile)
  if (tests.length > 0)
    lines.push(`  - 测试：${listFiles(tests)}`)
  if (commit.pinned.has(node))
    lines.push(`  - 归入原因：${commit.pinned.get(node)}`)
  const others = [...commit.nodes.keys()].filter(other => other !== node)
  if (others.length > 0)
    lines.push(`  - 还涉及：${others.join('、')}`)
  lines.push(`  - 链接：${UPSTREAM_COMMIT_URL}${commit.hash}`)
  return lines.join('\n')
}

function sectionOf(commit) {
  return TYPE_SECTIONS.includes(commit.type) ? commit.type : '其它'
}

/** 渲染一个节点的台账。commits 已按时间从旧到新排好。 */
export function renderNodeLedger(node, commits, range) {
  const breaking = commits.filter(commit => commit.breaking)
  const rest = commits.filter(commit => !commit.breaking)
  const out = [
    `# ${node} ${NODES[node]} · 上游改动台账`,
    '',
    `范围：${range} · 共 ${commits.length} 个提交 · 其中破坏性 ${breaking.length} 个`,
    '',
    '每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。',
    '',
    '## 破坏性改动',
    '',
  ]
  if (breaking.length === 0)
    out.push('无。', '')
  else
    out.push(...breaking.map(commit => renderNodeEntry(commit, node)), '')

  out.push('## 新功能 / 修复 / 其它', '')
  if (rest.length === 0)
    out.push('无。', '')
  for (const section of [...TYPE_SECTIONS, '其它']) {
    const items = rest.filter(commit => sectionOf(commit) === section)
    if (items.length === 0)
      continue
    out.push(`### ${section}`, '', ...items.map(commit => renderNodeEntry(commit, node)), '')
  }
  return `${out.join('\n').trimEnd()}\n`
}

/** 渲染无关提交清单：这些提交的所有文件都被规则判为无关。 */
export function renderUnrelated(commits, range) {
  const out = [
    '# 无关提交 · 上游改动台账',
    '',
    `范围：${range} · 共 ${commits.length} 个提交`,
    '',
    '这些提交改到的每个文件都被归类规则判为和 Vue 移植无关。原因来自 `scripts/upstream-ledger/rules.mjs`。',
    '',
  ]
  for (const commit of commits) {
    out.push(`- \`${shortHash(commit.hash)}\` ${commit.subject}`)
    out.push(`  - 原因：${commit.reasons.join('；')}`)
    if (commit.files.length > 0)
      out.push(`  - 文件：${listFiles(commit.files)}`)
    out.push(`  - 链接：${UPSTREAM_COMMIT_URL}${commit.hash}`)
  }
  return `${out.join('\n').trimEnd()}\n`
}

function describeTarget(rule) {
  if (rule.unrelated !== undefined)
    return '无关'
  if (Array.isArray(rule.nodes))
    return rule.nodes.join('、')
  return '查表'
}

/** 渲染总表、规则命中统计和「需要总控确认」。 */
export function renderSummary({ range, commits, byNode, unrelated }) {
  const allFiles = new Set(commits.flatMap(commit => commit.files))
  const out = [
    '# 上游差异台账 · 总表',
    '',
    `范围：${range}`,
    '',
    `- 非合并提交：${commits.length} 个，其中破坏性 ${commits.filter(c => c.breaking).length} 个`,
    `- 归入至少一个节点：${commits.length - unrelated.length} 个`,
    `- 全部文件无关：${unrelated.length} 个，见 [_unrelated.md](./_unrelated.md)`,
    `- 涉及上游文件：${allFiles.size} 个，没有落空的文件`,
    '',
    '## 各节点',
    '',
    '| 节点 | 名称 | 提交数 | 破坏性 | 涉及文件数 |',
    '| --- | --- | ---: | ---: | ---: |',
  ]
  for (const node of Object.keys(NODES)) {
    const list = byNode.get(node) ?? []
    if (list.length === 0) {
      out.push(`| ${node} | ${NODES[node]} | 0 | 0 | 0 |`)
      continue
    }
    const files = new Set(list.flatMap(commit => commit.nodes.get(node)))
    out.push(`| [${node}](./${node}.md) | ${NODES[node]} | ${list.length} | ${list.filter(c => c.breaking).length} | ${files.size} |`)
  }
  const unrelatedFiles = new Set(unrelated.flatMap(commit => commit.files))
  out.push(`| [无关](./_unrelated.md) | 全部文件无关的提交 | ${unrelated.length} | ${unrelated.filter(c => c.breaking).length} | ${unrelatedFiles.size} |`)

  const ruleFiles = new Map()
  for (const commit of commits) {
    for (const [rule, files] of commit.rules) {
      if (!ruleFiles.has(rule))
        ruleFiles.set(rule, new Set())
      for (const file of files)
        ruleFiles.get(rule).add(file)
    }
  }

  out.push('', '## 需要总控确认', '')
  out.push('下面这些归属是台账脚本按就近原则自行决定的，ROADMAP 没有写明。改归属请编辑 `scripts/upstream-ledger/rules.mjs` 后重新生成。', '')
  for (const rule of RULES.filter(r => r.review && ruleFiles.has(r.id))) {
    const files = [...ruleFiles.get(rule.id)].sort(compareText)
    out.push(`- ${rule.review}（规则 \`${rule.id}\` → ${describeTarget(rule)}，${files.length} 个文件，例如 ${files.slice(0, 3).map(f => `\`${f}\``).join('、')}）`)
  }

  const pinned = new Map()
  for (const commit of commits) {
    for (const [node, reason] of commit.pinned) {
      const key = `${node}\u0000${reason}`
      pinned.set(key, (pinned.get(key) ?? 0) + 1)
    }
  }
  if (pinned.size > 0) {
    out.push('', '## 按提交追加的归属', '')
    out.push('这些提交没有改到节点名下的路径，但 ROADMAP 点名由该节点处理。登记在 `rules.mjs` 的 `COMMIT_PINS` 和 `BREAKING_NODES`。', '')
    for (const [key, count] of [...pinned].sort(([a], [b]) => compareText(a, b))) {
      const [node, reason] = key.split('\u0000')
      out.push(`- ${node}：${reason}（${count} 个提交）`)
    }
  }

  out.push('', '## 规则命中统计', '')
  out.push('| 规则 | 归属 | 命中文件数 |', '| --- | --- | ---: |')
  for (const rule of RULES) {
    if (ruleFiles.has(rule.id))
      out.push(`| \`${rule.id}\` | ${describeTarget(rule)} | ${ruleFiles.get(rule.id).size} |`)
  }
  return `${out.join('\n').trimEnd()}\n`
}

/** 把归好类的提交渲染成全部台账文件。返回按文件名排序的 Map：文件名 → 内容。 */
export function renderLedger({ range, commits }) {
  const byNode = new Map()
  const unrelated = []
  for (const commit of commits) {
    if (commit.nodes.size === 0) {
      unrelated.push(commit)
      continue
    }
    for (const node of commit.nodes.keys()) {
      if (!byNode.has(node))
        byNode.set(node, [])
      byNode.get(node).push(commit)
    }
  }
  const files = new Map()
  for (const node of sortNodes(byNode.keys()))
    files.set(`${node}.md`, renderNodeLedger(node, byNode.get(node), range))
  files.set('_unrelated.md', renderUnrelated(unrelated, range))
  files.set('_summary.md', renderSummary({ range, commits, byNode, unrelated }))
  return new Map([...files].sort(([a], [b]) => compareText(a, b)))
}

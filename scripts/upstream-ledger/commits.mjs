// 从上游仓库读取提交，并按 rules.mjs 把每个提交归到节点。

import { execFileSync } from 'node:child_process'
import { BREAKING_NODES, classifyPath, COMMIT_PINS, NODES, RULES } from './rules.mjs'

const RECORD = '\x1E'
const FIELD = '\x1F'

/** 在指定仓库里执行 git，返回标准输出。 */
function git(cwd, args) {
  return execFileSync('git', ['-c', 'core.quotepath=off', ...args], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

/** 把版本号解析成完整提交哈希；版本号不存在时抛错。 */
export function resolveRevision(cwd, rev) {
  try {
    return git(cwd, ['rev-parse', '--verify', '--quiet', `${rev}^{commit}`]).trim()
  }
  catch {
    throw new Error(`上游仓库 ${cwd} 里找不到版本 ${rev}`)
  }
}

/**
 * 读取 from..to 之间的非合并提交，按提交时间从旧到新排序（同一秒的按哈希排序）。
 * 每个提交：{ hash, time, subject, body, files }，files 已去重并按路径排序。
 */
export function readCommits({ upstream, from, to }) {
  resolveRevision(upstream, from)
  resolveRevision(upstream, to)
  const output = git(upstream, [
    'log',
    '--no-merges',
    '--no-renames',
    '-z',
    `--format=${RECORD}%H${FIELD}%ct${FIELD}%s${FIELD}%b${FIELD}`,
    '--name-only',
    `${from}..${to}`,
  ])
  return parseLog(output)
}

/** 解析 readCommits 里那条 git log 命令的输出。 */
export function parseLog(output) {
  const commits = []
  for (const record of output.split(RECORD)) {
    if (!record.trim())
      continue
    const [hash, time, subject, body, rest = ''] = record.split(FIELD)
    const files = [...new Set(rest.split('\0').map(file => file.replace(/^\n+/, '')).filter(Boolean))]
    commits.push({
      hash: hash.trim(),
      time: Number(time),
      subject: subject.trim(),
      body: body.trim(),
      files: files.sort(compareText),
    })
  }
  return commits.sort((a, b) => a.time - b.time || compareText(a.hash, b.hash))
}

/** 按 UTF-16 码位比较，不受系统语言设置影响。 */
export function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

/** 按 NODES 里的登记顺序排序节点 ID。 */
export function sortNodes(nodes) {
  const order = Object.keys(NODES)
  return [...nodes].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

/** 提交标题的类型，例如 `feat(core)!: ...` 是 feat。认不出时返回 null。 */
export function commitType(subject) {
  const match = /^([a-z]+)(?:\([^)]*\))?!?:/i.exec(subject)
  return match ? match[1].toLowerCase() : null
}

/** 标题里类型后面带 `!`，或正文出现 BREAKING CHANGE，就是破坏性提交。 */
export function isBreaking(subject, body) {
  return /^[a-z]+(?:\([^)]*\))?!:/i.test(subject) || /BREAKING[ -]CHANGE/.test(body)
}

/** 提交标题末尾的 PR 编号，例如 `... (#7341)` 是 7341。没有时返回 null。 */
export function pullRequestNumber(subject) {
  const match = /\(#(\d+)\)\s*$/.exec(subject)
  return match ? Number(match[1]) : null
}

/**
 * 给所有提交归类。
 * 先按文件路径归类；再按 PR 编号追加 pins 里登记的节点，破坏性提交追加 breaking.nodes。
 * 返回 { commits, unmatched }：
 *   commits 里每项多出 type、breaking、nodes（节点 → 该节点的文件）、pinned（追加的节点 → 原因）、
 *   reasons（无关原因）、rules（命中的规则 → 文件）。
 *   unmatched 是没有被任何规则命中的文件，按路径排序；它非空时台账不能生成。
 */
export function classifyCommits(commits, { rules = RULES, pins = COMMIT_PINS, breaking: breakingPin = BREAKING_NODES } = {}) {
  const unmatched = new Set()
  const classified = commits.map((commit) => {
    const nodes = new Map()
    const reasons = new Set()
    const ruleHits = new Map()
    for (const file of commit.files) {
      const result = classifyPath(file, rules)
      if (!result) {
        unmatched.add(file)
        continue
      }
      if (!ruleHits.has(result.rule))
        ruleHits.set(result.rule, [])
      ruleHits.get(result.rule).push(file)
      if (result.nodes.length === 0) {
        reasons.add(result.reason)
        continue
      }
      for (const node of result.nodes) {
        if (!nodes.has(node))
          nodes.set(node, [])
        nodes.get(node).push(file)
      }
    }
    if (commit.files.length === 0)
      reasons.add('提交没有改动任何文件（空提交）')

    const breaking = isBreaking(commit.subject, commit.body)
    const extra = [pins[pullRequestNumber(commit.subject)], breaking ? breakingPin : null].filter(Boolean)
    const pinned = new Map()
    const relatedFiles = [...new Set([...nodes.values()].flat())].sort(compareText)
    for (const pin of extra) {
      for (const node of pin.nodes) {
        if (nodes.has(node))
          continue
        pinned.set(node, pin.reason)
        nodes.set(node, relatedFiles.length > 0 ? relatedFiles : commit.files)
      }
    }
    return {
      ...commit,
      type: commitType(commit.subject),
      breaking,
      nodes: new Map(sortNodes(nodes.keys()).map(node => [node, nodes.get(node)])),
      pinned,
      reasons: [...reasons].sort(compareText),
      rules: ruleHits,
    }
  })
  return { commits: classified, unmatched: [...unmatched].sort(compareText) }
}

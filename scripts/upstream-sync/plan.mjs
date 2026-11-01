import { execFileSync } from 'node:child_process'
import { classifyCommits, compareText, readCommits } from '../upstream-ledger/commits.mjs'
import { familyForNode } from './families.mjs'

const VERSION_TAG = /^v(\d+)\.(\d+)\.(\d+)$/

function compareTags(a, b) {
  const left = VERSION_TAG.exec(a)
  const right = VERSION_TAG.exec(b)
  for (let index = 1; index <= 3; index++) {
    const difference = Number(left[index]) - Number(right[index])
    if (difference)
      return difference
  }
  return compareText(a, b)
}

export function listVersionTags(upstream) {
  return execFileSync('git', ['tag', '--list'], { cwd: upstream, encoding: 'utf8' })
    .split('\n')
    .filter(tag => VERSION_TAG.test(tag))
    .sort(compareTags)
}

export function latestVersionTag(upstream) {
  const tag = listVersionTags(upstream).at(-1)
  if (!tag)
    throw new Error(`上游仓库 ${upstream} 没有稳定版本标签`)
  return tag
}

function commitsByFamily(commits) {
  const families = new Map()
  for (const commit of commits) {
    const grouped = new Map()
    for (const [node, files] of commit.nodes) {
      const family = familyForNode(node)
      if (!grouped.has(family.id))
        grouped.set(family.id, { family, files: new Set() })
      for (const file of files)
        grouped.get(family.id).files.add(file)
    }
    for (const { family, files } of grouped.values()) {
      if (!families.has(family.id))
        families.set(family.id, { ...family, commits: [] })
      families.get(family.id).commits.push({ ...commit, files: [...files].sort(compareText) })
    }
  }
  return [...families.values()].sort((a, b) => compareText(a.id, b.id))
}

export function buildSyncPlan({ upstream, from, to = latestVersionTag(upstream) }) {
  const tags = listVersionTags(upstream)
  if (!tags.includes(from))
    throw new Error(`syncedTo 必须是上游稳定版本标签，当前是 ${from}`)
  if (!tags.includes(to))
    throw new Error(`上游仓库 ${upstream} 里找不到版本 ${to}`)
  if (compareTags(from, to) > 0)
    throw new Error(`起始版本 ${from} 不能晚于目标版本 ${to}`)

  const targets = tags.filter(tag => compareTags(tag, from) > 0 && compareTags(tag, to) <= 0)
  const plan = []
  let previous = from
  for (const tag of targets) {
    const { commits, unmatched } = classifyCommits(readCommits({ upstream, from: previous, to: tag }))
    if (unmatched.length)
      throw new Error(`有 ${unmatched.length} 个上游文件没有被任何归类规则命中：\n${unmatched.map(file => `  ${file}`).join('\n')}`)
    plan.push({ from: previous, to: tag, families: commitsByFamily(commits) })
    previous = tag
  }
  return plan
}

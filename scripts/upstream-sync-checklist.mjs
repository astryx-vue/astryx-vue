#!/usr/bin/env node
// 待同步清单的日常操作：看进度、自动初筛、给某个组件族导出待办、把核对结果批量勾回去。
// 清单在 upstream-sync/pending 分支上；用 --checklist 指向检出的那份文件。

import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { resolveUpstreamDir } from './upstream-ledger.mjs'
import { applyResults, familyProgress, headingMatches, parseChecklist, parseResults } from './upstream-sync/checklist.mjs'
import { listFamilies } from './upstream-sync/families.mjs'
import { buildSyncPlan } from './upstream-sync/plan.mjs'
import { triageFiles } from './upstream-sync/triage-rules.mjs'

const USAGE = `用法：node scripts/upstream-sync-checklist.mjs <命令> --checklist <pending.md> [选项]

  status                               每个组件族已勾 / 没勾的条数
  triage [--write]                     按 upstream-sync/triage-rules.mjs 自动判「不适用」，--write 才写回
  worklist --family <id 或标题> [--out <文件>]   列出这个族没勾的条目和它在本族改到的上游文件
  tick --results <文件> [--family <id 或标题>]    把「哈希 | 结论 | 说明」逐行勾回清单

  --upstream <目录>   上游仓库克隆，默认按 upstream-ledger 的规则找`

export function parseArgs(argv) {
  const options = { command: argv[0], write: false }
  for (let index = 1; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--write')
      options.write = true
    else if (arg.startsWith('--'))
      options[arg.slice(2)] = argv[++index]
  }
  return options
}

/** 族 id 换成标题；本来就是标题的原样返回。 */
export function resolveFamilyTitle(value) {
  return listFamilies().find(family => family.id === value)?.title ?? value
}

function readRange(markdown) {
  const match = /上游范围：`(v[\d.]+)\.\.(v[\d.]+)`/.exec(markdown)
  if (!match)
    throw new Error('清单开头找不到「上游范围：`vA..vB`」')
  return { from: match[1], to: match[2] }
}

/** 「族标题 + 哈希」到这个提交在该族里改到的上游文件。 */
function familyFiles(markdown, upstream) {
  const plan = buildSyncPlan({ upstream, ...readRange(markdown) })
  const files = new Map()
  for (const release of plan) {
    for (const family of release.families) {
      for (const commit of family.commits)
        files.set(`${family.title}\n${commit.hash.slice(0, 9)}`, commit.files)
    }
  }
  return files
}

function titleOf(heading) {
  return heading.replace(/^## /, '').replace(/（.*$/, '')
}

function triage(markdown, upstream) {
  const files = familyFiles(markdown, upstream)
  let output = markdown
  let count = 0
  const byFamily = new Map()
  for (const entry of parseChecklist(markdown).entries) {
    if (entry.checked)
      continue
    const reasons = triageFiles(files.get(`${titleOf(entry.heading)}\n${entry.hash}`) ?? [])
    if (!reasons)
      continue
    const title = titleOf(entry.heading)
    byFamily.set(title, [...(byFamily.get(title) ?? []), { hash: entry.hash, status: '不适用', kind: '不适用', note: `${reasons.join('、')}（自动初筛）` }])
    count += 1
  }
  for (const [family, results] of byFamily)
    output = applyResults(output, results, { family }).markdown
  return { markdown: output, count }
}

/** 别的组件族已经处理过这个提交时，把那边的结论带上，免得重复移植。 */
function otherFamilyNotes(lines, entries, entry) {
  return entries
    .filter(other => other.hash === entry.hash && other.checked && other.heading !== entry.heading)
    .flatMap(other => lines.slice(other.line + 1, other.end + 1)
      .filter(line => !line.includes('自动初筛'))
      .map(line => `    [${titleOf(other.heading)}] ${line.trim().replace(/^- /, '')}`))
}

function worklist(markdown, upstream, family) {
  const files = familyFiles(markdown, upstream)
  const { lines, entries } = parseChecklist(markdown)
  const rows = []
  for (const entry of entries) {
    if (entry.checked || !headingMatches(entry.heading, family))
      continue
    rows.push(`${entry.hash} ${entry.subject}`)
    for (const file of files.get(`${family}\n${entry.hash}`) ?? [])
      rows.push(`    ${file}`)
    rows.push(...otherFamilyNotes(lines, entries, entry))
  }
  return rows.join('\n')
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!options.command || !options.checklist || options.command === '--help') {
    console.log(USAGE)
    process.exitCode = options.command ? 0 : 2
    return
  }
  const markdown = readFileSync(options.checklist, 'utf8')
  const upstream = () => resolveUpstreamDir(options.upstream)
  if (options.command === 'status') {
    for (const item of familyProgress(markdown))
      console.log(`${String(item.open).padStart(5)} 没勾  ${String(item.done).padStart(5)} 已勾  ${item.heading.slice(3)}`)
  }
  else if (options.command === 'triage') {
    const result = triage(markdown, upstream())
    if (options.write)
      writeFileSync(options.checklist, result.markdown)
    console.log(`${options.write ? '已勾选' : '可以自动判「不适用」'}：${result.count} 条`)
  }
  else if (options.command === 'worklist') {
    const text = worklist(markdown, upstream(), resolveFamilyTitle(options.family))
    if (options.out)
      writeFileSync(options.out, `${text}\n`)
    else
      console.log(text)
  }
  else if (options.command === 'tick') {
    const { results, problems } = parseResults(readFileSync(options.results, 'utf8'))
    const family = options.family ? resolveFamilyTitle(options.family) : undefined
    const { markdown: next, hits } = applyResults(markdown, results, { family })
    writeFileSync(options.checklist, next)
    const missed = [...hits].filter(([, n]) => n === 0).map(([hash]) => hash)
    console.log(`写回 ${results.length - missed.length} 条结果${missed.length ? `；${missed.length} 条没找到没勾的条目：${missed.join(' ')}` : ''}`)
    for (const problem of problems)
      console.log(problem)
    if (problems.length)
      process.exitCode = 1
  }
  else {
    console.log(USAGE)
    process.exitCode = 2
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  main()

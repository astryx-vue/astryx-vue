#!/usr/bin/env node
// 生成上游差异台账：把上游 from..to 之间的每个提交按改到的文件路径归到任务树节点，
// 每个节点写一份 <节点ID>.md 勾选清单，另写 _unrelated.md 和 _summary.md。
//
// 用法：node scripts/upstream-ledger.mjs [--from <rev>] [--to <rev>] [--upstream <dir>] [--out <dir>] [--check]
//   --from      起点（不含），默认 96f9917f（上游 0.4.1）
//   --to        终点（含），默认 v0.7.1
//   --upstream  上游仓库目录，默认 ../astryx-upstream（相对仓库根目录），也可用环境变量 ASTRYX_UPSTREAM_DIR
//   --out       输出目录，默认 .agents-work/upstream-sync/ledger
//   --check     只比较不写入，产物和磁盘上的不一致时退出码为 1
//
// 节点台账里已经打的勾和条目下的备注会保留下来，见 upstream-ledger/annotations.mjs。
// `--check` 比较时忽略这些人写的内容。
//
// 有文件没被任何规则命中时，脚本列出这些文件并以退出码 2 结束，不写任何产物。

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { applyAnnotations, isNodeLedger, readAnnotations, stripAnnotations } from './upstream-ledger/annotations.mjs'
import { classifyCommits, readCommits } from './upstream-ledger/commits.mjs'
import { renderLedger } from './upstream-ledger/render.mjs'
import { validateRules } from './upstream-ledger/rules.mjs'

export const DEFAULT_FROM = '96f9917f'
export const DEFAULT_TO = 'v0.7.1'
export const DEFAULT_OUT = '.agents-work/upstream-sync/ledger'

/** 输出目录里由人维护、脚本不会覆盖也不会删除的文件。 */
const PRESERVED_FILES = new Set(['README.md'])

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export class UnmatchedFilesError extends Error {
  constructor(files) {
    super(`有 ${files.length} 个上游文件没有被任何归类规则命中：\n${files.map(file => `  ${file}`).join('\n')}\n请在 scripts/upstream-ledger/rules.mjs 里补规则。`)
    this.files = files
  }
}

/**
 * 读上游提交、归类、渲染。返回 Map：文件名 → 内容。
 * rules、pins、breaking 默认取 rules.mjs 里的 RULES、COMMIT_PINS、BREAKING_NODES，测试时可以替换。
 * 有落空文件时抛 UnmatchedFilesError。
 */
export function buildLedger({ upstream, from = DEFAULT_FROM, to = DEFAULT_TO, rules, pins, breaking }) {
  const problems = validateRules(rules)
  if (problems.length > 0)
    throw new Error(`归类规则有误：\n${problems.join('\n')}`)
  const { commits, unmatched } = classifyCommits(readCommits({ upstream, from, to }), { rules, pins, breaking })
  if (unmatched.length > 0)
    throw new UnmatchedFilesError(unmatched)
  return renderLedger({ range: `${from}..${to}`, commits })
}

/** 磁盘上的台账去掉人写的勾选和备注以后的内容，用来和生成结果比较。 */
function generatedPart(name, text) {
  return isNodeLedger(name) ? stripAnnotations(text) : text
}

/** 比较产物和输出目录。返回不一致的文件名列表（缺失、内容不同、多余的都算）。勾选和备注不算不一致。 */
export function diffLedger(outDir, files) {
  const differences = []
  for (const [name, content] of files) {
    const path = join(outDir, name)
    if (!existsSync(path) || generatedPart(name, readFileSync(path, 'utf8')) !== content)
      differences.push(name)
  }
  for (const name of listGenerated(outDir)) {
    if (!files.has(name))
      differences.push(name)
  }
  return differences.sort()
}

/**
 * 写入产物，并删掉上次生成、这次不再产出的台账文件。
 * 节点台账先读出旧文件里的勾选和备注，再放回新内容里。
 * 要删的旧台账里还有勾选或备注时，什么都不写，直接报错，免得人写的结论丢掉。
 * @returns {{ restored: number, orphans: Map<string, string[]> }} 认回去的条数，以及每个文件里放进「旧结论」一节的短哈希
 */
export function writeLedger(outDir, files) {
  mkdirSync(outDir, { recursive: true })
  const stale = listGenerated(outDir).filter(name => !files.has(name))
  const annotated = stale.filter(name => isNodeLedger(name) && readAnnotations(readFileSync(join(outDir, name), 'utf8')).size > 0)
  if (annotated.length > 0)
    throw new Error(`这些台账这次不再生成，但里面还有勾选或备注：${annotated.join('、')}。先把结论挪走再重新生成。`)
  const outputs = new Map()
  let restored = 0
  const orphans = new Map()
  for (const [name, content] of files) {
    const path = join(outDir, name)
    if (!isNodeLedger(name) || !existsSync(path)) {
      outputs.set(name, content)
      continue
    }
    const merged = applyAnnotations(content, readAnnotations(readFileSync(path, 'utf8')))
    outputs.set(name, merged.text)
    restored += merged.restored
    if (merged.orphans.length > 0)
      orphans.set(name, merged.orphans)
  }
  for (const name of stale)
    rmSync(join(outDir, name))
  for (const [name, content] of outputs)
    writeFileSync(join(outDir, name), content)
  return { restored, orphans }
}

function listGenerated(outDir) {
  if (!existsSync(outDir))
    return []
  return readdirSync(outDir).filter(name => name.endsWith('.md') && !PRESERVED_FILES.has(name))
}

/**
 * 找上游仓库目录。顺序：--upstream、ASTRYX_UPSTREAM_DIR、仓库根目录旁边的 astryx-upstream。
 * 在 git worktree 里跑时，仓库根目录旁边没有上游仓库，再试主工作区旁边的。
 */
export function resolveUpstreamDir(explicit, env = process.env) {
  if (explicit)
    return resolve(explicit)
  if (env.ASTRYX_UPSTREAM_DIR)
    return resolve(env.ASTRYX_UPSTREAM_DIR)
  const candidates = [resolve(repoRoot, '../astryx-upstream')]
  try {
    const commonDir = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: repoRoot, encoding: 'utf8' }).trim()
    candidates.push(resolve(dirname(commonDir), '../astryx-upstream'))
  }
  catch {}
  return candidates.find(dir => existsSync(dir)) ?? candidates[0]
}

export function parseArgs(argv) {
  const options = { from: DEFAULT_FROM, to: DEFAULT_TO, upstream: null, out: DEFAULT_OUT, check: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--check') {
      options.check = true
      continue
    }
    const key = { '--from': 'from', '--to': 'to', '--upstream': 'upstream', '--out': 'out' }[arg]
    if (!key || i + 1 >= argv.length || argv[i + 1].startsWith('--'))
      throw new Error(`无法识别的参数：${arg}\n用法：node scripts/upstream-ledger.mjs [--from <rev>] [--to <rev>] [--upstream <dir>] [--out <dir>] [--check]`)
    options[key] = argv[++i]
  }
  return options
}

export function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv)
  const upstream = resolveUpstreamDir(options.upstream)
  if (!existsSync(upstream))
    throw new Error(`找不到上游仓库 ${upstream}，请用 --upstream 或 ASTRYX_UPSTREAM_DIR 指定`)
  const outDir = resolve(repoRoot, options.out)
  const files = buildLedger({ upstream, from: options.from, to: options.to })
  if (options.check) {
    const differences = diffLedger(outDir, files)
    if (differences.length > 0) {
      console.error(`台账和 ${options.from}..${options.to} 的生成结果不一致：\n${differences.map(name => `  ${name}`).join('\n')}\n运行 node scripts/upstream-ledger.mjs 重新生成。`)
      return 1
    }
    console.log(`台账是最新的（${files.size} 个文件）。`)
    return 0
  }
  const { restored, orphans } = writeLedger(outDir, files)
  console.log(`已生成 ${files.size} 个台账文件到 ${outDir}，保留了 ${restored} 条已有的勾选或备注`)
  for (const [name, hashes] of orphans)
    console.error(`${name}：${hashes.join('、')} 不再归这个节点，原来的结论移到了文件末尾的「已不在本节点的旧结论」`)
  return 0
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main()
  }
  catch (error) {
    console.error(error.message)
    process.exitCode = error instanceof UnmatchedFilesError ? 2 : 1
  }
}

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { ALLOWLIST_FILE, EXCLUDES, LINE_LIMIT, SOURCE_EXTENSIONS } from './guardrails/line-limit.config.mjs'

// 源码单文件不超过 500 行。已经超标的旧文件记在白名单里，只能变小不能变大。
// 取文件列表（listCandidateFiles、selectSourceFiles）和判定（evaluateLineLimit）
// 分成独立的函数，测试可以直接喂假的文件列表。

const SPLIT_ADVICE = '请把它拆成职责单一的小模块，例如提炼子组件、抽出纯函数或按功能拆分子文件。'

/** git 跟踪的文件，加上还没提交、也没被 .gitignore 忽略的新文件。 */
export function listCandidateFiles(rootDir) {
  return execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
    .split('\0')
    .filter(Boolean)
}

/** 某个路径命中的排除规则；不排除时返回 undefined。 */
export function findExclude(file, excludes = EXCLUDES) {
  return excludes.find(rule => rule.pattern.test(file))
}

/** 从候选文件里挑出要统计的源码文件，去重并排序。 */
export function selectSourceFiles(files, { extensions = SOURCE_EXTENSIONS, excludes = EXCLUDES } = {}) {
  const picked = new Set()
  for (const file of files) {
    if (!extensions.some(ext => file.endsWith(ext)))
      continue
    if (findExclude(file, excludes))
      continue
    picked.add(file)
  }
  return [...picked].sort(comparePath)
}

/** 物理行数，口径和 `wc -l` 一致：数换行符。 */
export function countLines(text) {
  let count = 0
  for (let index = text.indexOf('\n'); index !== -1; index = text.indexOf('\n', index + 1))
    count += 1
  return count
}

/** 读出每个文件的行数。工作区里已经删掉的文件不算。 */
export function readLineCounts(rootDir, files) {
  const counts = new Map()
  for (const file of files) {
    const absolute = join(rootDir, file)
    if (!existsSync(absolute))
      continue
    counts.set(file, countLines(readFileSync(absolute, 'utf8')))
  }
  return counts
}

function comparePath(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * 判定。
 * @param {object} input
 * @param {Map<string, number>} input.lineCounts 统计范围内每个文件的行数
 * @param {Record<string, number>} input.allowlist 白名单
 * @param {(file: string) => boolean} input.exists 文件在工作区里是否存在
 * @param {number} [input.limit]
 * @returns {{ errors: string[], hints: string[], tightened: Record<string, number> }}
 *   tightened 是收紧后的白名单：只会改小数字、删掉过期条目，不会新增或改大。
 */
export function evaluateLineLimit({ lineCounts, allowlist, exists, limit = LINE_LIMIT }) {
  const errors = []
  const hints = []
  const tightened = {}

  for (const [file, lines] of lineCounts) {
    if (lines > limit && !Object.hasOwn(allowlist, file))
      errors.push(`${file} 有 ${lines} 行，超过上限 ${limit} 行。${SPLIT_ADVICE}新文件不能加进白名单。`)
  }

  for (const file of Object.keys(allowlist).sort(comparePath)) {
    const recorded = allowlist[file]
    if (!lineCounts.has(file)) {
      if (exists(file))
        errors.push(`白名单里的 ${file} 已经不在统计范围内，请从 ${ALLOWLIST_FILE} 删掉这一条（可以运行 node scripts/check-line-limit.mjs --update）。`)
      else
        errors.push(`白名单里的 ${file} 已经不存在，请从 ${ALLOWLIST_FILE} 删掉这一条（可以运行 node scripts/check-line-limit.mjs --update）。`)
      continue
    }
    const lines = lineCounts.get(file)
    if (lines > recorded) {
      errors.push(`${file} 有 ${lines} 行，比白名单记录的 ${recorded} 行多了 ${lines - recorded} 行，上限 ${limit} 行。白名单里的旧文件不能继续变大。${SPLIT_ADVICE}`)
      tightened[file] = recorded
      continue
    }
    if (lines <= limit) {
      errors.push(`${file} 已经降到 ${lines} 行，不超过上限 ${limit} 行了，请从 ${ALLOWLIST_FILE} 删掉这一条（可以运行 node scripts/check-line-limit.mjs --update）。`)
      continue
    }
    if (lines < recorded)
      hints.push(`${file} 从 ${recorded} 行降到了 ${lines} 行，可以收紧白名单（运行 node scripts/check-line-limit.mjs --update）。`)
    tightened[file] = lines
  }

  return { errors, hints, tightened }
}

export function readAllowlist(rootDir) {
  const file = join(rootDir, ALLOWLIST_FILE)
  if (!existsSync(file))
    return {}
  return JSON.parse(readFileSync(file, 'utf8'))
}

export function formatAllowlist(allowlist) {
  const sorted = Object.fromEntries(Object.keys(allowlist).sort(comparePath).map(file => [file, allowlist[file]]))
  return `${JSON.stringify(sorted, null, 2)}\n`
}

/**
 * 跑一次完整检查。update 为 true 时把收紧后的白名单写回去。
 * listFiles 可以换掉，测试用它提供假的文件列表。
 */
export function runLineLimitCheck({ rootDir, update = false, listFiles = listCandidateFiles }) {
  const files = selectSourceFiles(listFiles(rootDir))
  const lineCounts = readLineCounts(rootDir, files)
  const allowlist = readAllowlist(rootDir)
  const result = evaluateLineLimit({
    lineCounts,
    allowlist,
    exists: file => existsSync(join(rootDir, file)),
  })
  if (!update)
    return { ...result, updated: false }

  const next = formatAllowlist(result.tightened)
  const changed = next !== formatAllowlist(allowlist)
  if (changed)
    writeFileSync(join(rootDir, ALLOWLIST_FILE), next)
  const after = evaluateLineLimit({
    lineCounts,
    allowlist: result.tightened,
    exists: file => existsSync(join(rootDir, file)),
  })
  return { ...after, updated: changed }
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirect) {
  const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
  const result = runLineLimitCheck({ rootDir, update: process.argv.includes('--update') })
  if (result.updated)
    console.log(`已收紧 ${ALLOWLIST_FILE}。`)
  for (const hint of result.hints)
    console.log(`提示：${hint}`)
  if (result.errors.length > 0) {
    console.error(`源码单文件行数检查没通过（上限 ${LINE_LIMIT} 行）：`)
    for (const error of result.errors)
      console.error(`- ${error}`)
    process.exitCode = 1
  }
  else {
    console.log(`源码单文件行数检查通过（上限 ${LINE_LIMIT} 行）。`)
  }
}

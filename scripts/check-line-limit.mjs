import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { EXCLUDES, LINE_LIMIT, SOURCE_EXTENSIONS } from './guardrails/line-limit.config.mjs'

// 源码单文件不超过 500 行，超过就报错。
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
 * 判定哪些文件超过上限。
 * @param {object} input
 * @param {Map<string, number>} input.lineCounts 统计范围内每个文件的行数
 * @param {number} [input.limit]
 * @returns {{ errors: string[] }} 每个超标文件一条错误说明
 */
export function evaluateLineLimit({ lineCounts, limit = LINE_LIMIT }) {
  const errors = []
  for (const [file, lines] of lineCounts) {
    if (lines > limit)
      errors.push(`${file} 有 ${lines} 行，超过上限 ${limit} 行。${SPLIT_ADVICE}`)
  }
  return { errors }
}

/**
 * 跑一次完整检查。
 * listFiles 可以换掉，测试用它提供假的文件列表。
 */
export function runLineLimitCheck({ rootDir, listFiles = listCandidateFiles }) {
  const files = selectSourceFiles(listFiles(rootDir))
  return evaluateLineLimit({ lineCounts: readLineCounts(rootDir, files) })
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirect) {
  const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
  const result = runLineLimitCheck({ rootDir })
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

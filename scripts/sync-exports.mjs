// `pnpm sync` 的入口：算出全部生成文件，写盘后跑 eslint --fix，再和原文比较。
// `--check` 模式下有差异就把文件还原，并打印差异摘要。
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { renderPackageExports } from './sync-exports/package-exports.mjs'
import { renderCoreStyles, renderThemeEntries } from './sync-exports/render-css.mjs'
import { renderComposables, renderIndex } from './sync-exports/render-index.mjs'
import { renderMessages } from './sync-exports/render-messages.mjs'

/**
 * 整个文件都由 `pnpm sync` 生成的文件：绝对路径 → 内容。
 * `packages/core/package.json` 只有 exports 字段是生成的，不在这里，见 syncOutputs。
 * 合并工具（scripts/swarm/worktree.mjs rebase）按这份清单判断哪些冲突可以重新生成。
 */
export function generatedFiles(rootDir) {
  const composables = renderComposables(rootDir)
  const files = new Map([
    [join(rootDir, 'packages/core/src/index.ts'), renderIndex(rootDir)],
    [join(rootDir, 'packages/core/src/composables/index.ts'), composables.text],
    renderCoreStyles(rootDir),
    [join(rootDir, 'packages/core/src/locale/messages.ts'), renderMessages(rootDir)],
  ])
  for (const [file, contents] of renderThemeEntries(rootDir))
    files.set(file, contents)
  return files
}

/** `pnpm sync` 要写的全部文件：整份生成的文件，加上 exports 有变化时的 package.json。 */
function syncOutputs(rootDir) {
  const files = generatedFiles(rootDir)
  const packageExports = renderPackageExports(rootDir)
  if (packageExports.changed)
    files.set(packageExports.file, packageExports.text)
  return files
}

function readOptional(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : null
}

function writeFiles(files) {
  for (const [file, contents] of files) {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, contents)
  }
}

function restoreFiles(originals) {
  for (const [file, contents] of originals) {
    if (contents == null)
      continue
    writeFileSync(file, contents)
  }
}

function eslintFix(rootDir, files) {
  if (files.length === 0)
    return
  const result = spawnSync('pnpm', ['exec', 'eslint', '--fix', ...files], {
    cwd: rootDir,
    stdio: 'inherit',
  })
  if (result.status !== 0)
    throw new Error('eslint --fix 失败')
}

function diffSummary(before, after) {
  const beforeLines = (before ?? '').split('\n')
  const afterLines = after.split('\n')
  const lines = []
  const max = Math.max(beforeLines.length, afterLines.length)
  for (let index = 0; index < max && lines.length < 40; index += 1) {
    if (beforeLines[index] !== afterLines[index]) {
      lines.push(`- ${beforeLines[index] ?? ''}`)
      lines.push(`+ ${afterLines[index] ?? ''}`)
    }
  }
  return lines.join('\n')
}

export async function syncExports({ rootDir, check = false, eslint = true }) {
  const files = syncOutputs(rootDir)
  const originals = new Map([...files.keys()].map(file => [file, readOptional(file)]))
  writeFiles(files)
  const tsFiles = [...files.keys()].filter(file => file.endsWith('.ts'))
  try {
    if (eslint)
      eslintFix(rootDir, tsFiles)
  }
  catch (error) {
    if (check)
      restoreFiles(originals)
    throw error
  }

  const mismatches = []
  for (const file of files.keys()) {
    const next = readFileSync(file, 'utf8')
    if (next !== originals.get(file))
      mismatches.push(file)
  }

  if (check && mismatches.length > 0) {
    const details = mismatches.map((file) => {
      const relativePath = relative(rootDir, file)
      return `${relativePath}\n${diffSummary(originals.get(file), readFileSync(file, 'utf8'))}`
    }).join('\n\n')
    restoreFiles(originals)
    return {
      ok: false,
      message: `生成结果和已提交文件不一致，请运行 pnpm sync：\n${details}`,
    }
  }

  return {
    ok: true,
    message: check ? '生成结果和已提交文件一致。' : '已写好生成文件。',
    files: [...files.keys()],
  }
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirect) {
  const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
  const result = await syncExports({
    rootDir,
    check: process.argv.includes('--check'),
  })
  console.log(result.message)
  if (!result.ok)
    process.exitCode = 1
}

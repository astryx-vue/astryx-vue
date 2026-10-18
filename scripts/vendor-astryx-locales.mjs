/**
 * 从 facebook/astryx 拉 packages/core/locales/*.json，不手抄译文。
 *
 * 默认跟随原版 main 的最新提交，让译文始终对得上原版：
 *   node scripts/vendor-astryx-locales.mjs
 * 需要复现某一次抓取时，把当时的提交号传进去：
 *   node scripts/vendor-astryx-locales.mjs <commit>
 * 实际用到的提交号会写进 SOURCE.json，方便追溯。
 *
 * 文件末尾多出来的空行会收成一个换行，避免和代码检查打架。
 * 这些 JSON 不参与 ESLint，见 eslint.config.mjs。
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ref = process.argv[2] ?? 'main'
const repository = 'https://github.com/facebook/astryx'
const sourcePath = 'packages/core/locales'
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const targetDir = join(rootDir, 'packages/core/locales')

const headers = {
  'accept': 'application/vnd.github+json',
  'user-agent': 'astryx-vue-locale-vendor',
}

// 把分支名、标签或提交号统一换成具体的提交号，写进 SOURCE.json。
const commitResponse = await fetch(`https://api.github.com/repos/facebook/astryx/commits/${ref}`, { headers })
if (!commitResponse.ok)
  throw new Error(`解析 ${ref} 失败：${commitResponse.status}`)
const commit = (await commitResponse.json()).sha

const listing = await fetch(`https://api.github.com/repos/facebook/astryx/contents/${sourcePath}?ref=${commit}`, { headers })
if (!listing.ok)
  throw new Error(`拉取语言目录列表失败：${listing.status}`)

const entries = await listing.json()
const files = entries
  .filter(entry => entry.type === 'file' && entry.name.endsWith('.json'))
  .map(entry => entry.name)
  .sort()

if (files.length < 30)
  throw new Error(`原版语言文件只有 ${files.length} 个，少于预期的 30 个`)

mkdirSync(targetDir, { recursive: true })
for (const name of files) {
  const url = `https://raw.githubusercontent.com/facebook/astryx/${commit}/${sourcePath}/${name}`
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`拉取 ${name} 失败：${response.status}`)
  const text = (await response.text()).replace(/\s*$/, '\n')
  writeFileSync(join(targetDir, name), text)
  console.log(name)
}

const source = { repository, path: sourcePath, commit, files }
writeFileSync(join(targetDir, 'SOURCE.json'), `${JSON.stringify(source, null, 2)}\n`)
console.log(`已写入 ${files.length} 个语言文件，提交 ${commit}`)

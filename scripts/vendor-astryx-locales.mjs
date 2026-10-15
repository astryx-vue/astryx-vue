/**
 * 从 facebook/astryx 的某个提交把 packages/core/locales/*.json 拉下来。
 * 不手抄译文。换提交时改下面的 commit，再运行：
 * node scripts/vendor-astryx-locales.mjs
 *
 * 文件末尾多出来的空行会收成一个换行，避免和代码检查打架。
 * 这些 JSON 不参与 ESLint，见 eslint.config.mjs。
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const commit = 'df75749470029f0b34680e13deac635f2d72c89d'
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const targetDir = join(rootDir, 'packages/core/locales')
const listUrl = `https://api.github.com/repos/facebook/astryx/contents/packages/core/locales?ref=${commit}`

const listing = await fetch(listUrl, {
  headers: {
    'accept': 'application/vnd.github+json',
    'user-agent': 'astryx-vue-locale-vendor',
  },
})
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
  const url = `https://raw.githubusercontent.com/facebook/astryx/${commit}/packages/core/locales/${name}`
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`拉取 ${name} 失败：${response.status}`)
  const text = (await response.text()).replace(/\s*$/, '\n')
  writeFileSync(join(targetDir, name), text)
  console.log(name)
}

const source = {
  repository: 'https://github.com/facebook/astryx',
  path: 'packages/core/locales',
  commit,
  files,
}
writeFileSync(join(targetDir, 'SOURCE.json'), `${JSON.stringify(source, null, 2)}\n`)
console.log(`已写入 ${files.length} 个语言文件，提交 ${commit}`)

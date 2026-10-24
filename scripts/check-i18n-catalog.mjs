// i18n 目录检查：`node scripts/check-i18n-catalog.mjs`，接在 `pnpm check:packages` 里。
//
// 运行时对不上的文案不会报错：键找不到就原样显示键名，占位符对不上就留空或者退回英文。
// 这个脚本在提交前把这些情况拦下来：
//   1. 内置文案的每个字段，en 和 zh-CN 都有，形状一样，不为空。
//   2. upstreamMap 写到的每个原版键都在 locales/en.json 里，字段存在，args 正好是原文的占位符。
//   3. en 和 zh-CN 内置文案都用上了原版的每个占位符，结果里不残留 `{name}`。
//   4. 内置英文和原版英文逐字一致。
//   5. 29 种语言的每句译文都能解析，占位符的名字和写法和英文原文一致；没有过期的键。
//   6. en.json 的每个键要么接进了 upstreamMap，要么在 coverage.mjs 里写明了暂不接入的理由。
//   7. 源码里 `t('@astryx.…')` 用到的键都在 upstreamMap 里。
// 译文少键（还没翻译）是正常状态，只作为提示打印。
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  checkBuiltInParity,
  checkBuiltInPlaceholders,
  checkCoverage,
  checkEnglishText,
  checkLocaleContracts,
  checkMapTargets,
  checkSourceRefs,
} from './i18n-catalog/checks.mjs'
import { UNPORTED_NAMESPACES } from './i18n-catalog/coverage.mjs'
import './i18n-catalog/ts-hooks.mjs'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const coreDir = join(rootDir, 'packages/core')
const localesDir = join(coreDir, 'locales')
const SOURCE_PATTERN = /\.(?:ts|vue)$/
const SKIPPED_SOURCE = /\.(?:test|spec)\.ts$/

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function readCatalogs() {
  const catalogs = {}
  for (const name of readdirSync(localesDir).sort()) {
    if (!name.endsWith('.json') || name === 'SOURCE.json' || name === 'en.json')
      continue
    catalogs[name.replace(/\.json$/, '')] = readJson(join(localesDir, name))
  }
  return catalogs
}

function readSources(dir) {
  const files = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory())
      files.push(...readSources(path))
    else if (SOURCE_PATTERN.test(name) && !SKIPPED_SOURCE.test(name))
      files.push({ path: relative(rootDir, path), text: readFileSync(path, 'utf8') })
  }
  return files
}

async function loadCore() {
  const load = path => import(pathToFileURL(join(coreDir, 'src/locale', path)).href)
  const [{ upstreamMessageMap }, { astryxMessages }, { icuArgumentKinds, formatIcu }] = await Promise.all([
    load('upstreamMap.ts'),
    load('messages.ts'),
    load('icu.ts'),
  ])
  return { map: upstreamMessageMap, messages: astryxMessages, icu: { argumentKinds: icuArgumentKinds, format: formatIcu } }
}

async function main() {
  const { map, messages, icu } = await loadCore()
  const enCatalog = readJson(join(localesDir, 'en.json'))
  const catalogs = readCatalogs()
  const contracts = checkLocaleContracts(enCatalog, catalogs, icu)
  const coverage = checkCoverage(enCatalog, map, UNPORTED_NAMESPACES)
  const refs = checkSourceRefs(readSources(join(coreDir, 'src')), map)

  const sections = [
    ['内置 en 和 zh-CN 的字段', checkBuiltInParity(messages.en, messages['zh-CN'])],
    ['upstreamMap 的键和字段', checkMapTargets(map, enCatalog, messages.en, icu)],
    ['内置文案的占位符', checkBuiltInPlaceholders(map, messages, enCatalog, icu)],
    ['内置英文和原版英文', checkEnglishText(map, messages.en, enCatalog, icu)],
    ['语言目录的 ICU 占位符', contracts.problems],
    ['原版键的接入情况', coverage.problems],
    ['源码里的 t() 调用', refs.problems],
  ]

  const failed = sections.filter(([, problems]) => problems.length > 0)
  if (failed.length > 0) {
    const total = failed.reduce((sum, [, problems]) => sum + problems.length, 0)
    console.error(`\ncheck:i18n-catalog 发现 ${total} 个问题：\n`)
    for (const [title, problems] of failed) {
      console.error(`  ${title}（${problems.length}）：`)
      for (const problem of problems)
        console.error(`    ${problem}`)
      console.error('')
    }
    process.exit(1)
  }

  const skipped = [...coverage.skipped].map(([namespace, count]) => `${namespace} ${count}`).join('，')
  console.log(`check:i18n-catalog 通过：upstreamMap ${Object.keys(map).length} 个键，${Object.keys(catalogs).length + 1} 个语言目录，源码 ${refs.count} 处 t() 调用。`)
  console.log(`  暂不接入（见 scripts/i18n-catalog/coverage.mjs）：${skipped}`)
  const gaps = Object.entries(contracts.untranslated).filter(([, count]) => count > 0)
  if (gaps.length > 0) {
    const counts = [...new Set(gaps.map(([, count]) => count))].sort((a, b) => a - b).join(' / ')
    console.log(`  ${gaps.length} 个语言目录还有 ${counts} 个键没翻译（共 ${Object.keys(enCatalog).length} 个），运行时用英文。`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  await main()

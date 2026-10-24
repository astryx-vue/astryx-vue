#!/usr/bin/env node
/**
 * 组件示例区的可访问性扫描：起文档站，拿浏览器锁，对每个组件页的示例区跑 axe，
 * 浅色、深色各一遍，写 report.json 和 report.md，再和已知问题名单对照。用法见 scripts/swarm/README.md。
 *
 * 资源纪律和视觉对照一样：
 * - 浏览器通过 browser-lock 拿锁，本进程只开 1 个 Chromium；
 * - 文档站固定 5172 端口，和 `pnpm visual` 共用租约，最后一个使用者关掉它；
 * - 正常结束、出错、Ctrl+C 都会关浏览器、关服务、还锁。
 *
 * 退出码：0 名单和实际一致；1 有新问题、有该删的名单条目，或者有页面扫描失败；2 参数错误。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { KNOWN_ISSUES_FILE, parseA11yArgs, SCHEMES, USAGE } from './a11y-scan/args.mjs'
import { collectIssues, compareWithKnown, describeComparison, seedKnown, tightenKnown } from './a11y-scan/baseline.mjs'
import { pageUrl, readDemoMetas, selectSlugs, slugsFromMetas } from './a11y-scan/pages.mjs'
import { buildReportJson, buildReportMd } from './a11y-scan/report.mjs'
import { DEMO_SELECTOR, scanPage } from './a11y-scan/scan.mjs'
import { withBrowserLock } from './browser-lock.mjs'
import { OURS_PORT } from './visual-compare/names.mjs'
import { acquireDocsServer } from './visual-compare/serve.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(import.meta.url)

function log(message) {
  console.error(message)
}

function versionOf(name) {
  return JSON.parse(readFileSync(require.resolve(`${name}/package.json`, { paths: [dirname(require.resolve('@axe-core/playwright'))] }), 'utf8')).version
}

const cleanups = []
let exiting = false
/** 收到信号后为真。用函数读，循环每轮都会重新看一眼。 */
const isExiting = () => exiting
function onSignal(signal) {
  if (exiting)
    return
  exiting = true
  log(`[a11y] 收到 ${signal}，正在清理`)
  cleanups.splice(0).reverse().reduce((p, fn) => p.then(() => fn()).catch(() => {}), Promise.resolve()).finally(() => process.exit(signal === 'SIGINT' ? 130 : 143))
}

/** 同一个浏览器里按颜色模式分两个上下文，每个上下文里最多同时开 `concurrency` 个页面。 */
async function scanAll(browser, { origin, slugs, schemes, concurrency }) {
  const pages = []
  for (const scheme of schemes) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce', locale: 'en-US' })
    try {
      let next = 0
      await Promise.all(Array.from({ length: Math.min(concurrency, slugs.length) }, async () => {
        while (!isExiting() && next < slugs.length) {
          const slug = slugs[next++]
          const result = await scanPage(context, { slug, url: pageUrl(origin, slug), scheme })
          pages.push(result)
          log(result.error
            ? `[a11y] ${scheme} ${slug} 失败：${result.error}`
            : `[a11y] ${scheme} ${slug}：${result.demos} 个示例，${result.violations.length} 条违规`)
        }
      }))
    }
    finally {
      await context.close().catch(() => {})
    }
  }
  return pages.sort((a, b) => (a.slug === b.slug ? (a.scheme < b.scheme ? -1 : 1) : a.slug < b.slug ? -1 : 1))
}

function readKnown(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
}

function writeKnown(file, known) {
  writeFileSync(file, `${JSON.stringify(known, null, 2)}\n`)
}

/** 对照名单，按需收紧或初始化，返回对照结果和是否通过。 */
function reconcile(options, { pages, allSlugs }) {
  const file = join(ROOT, KNOWN_ISSUES_FILE)
  const known = readKnown(file)
  const issues = collectIssues(pages.filter(page => page.error == null))
  if (known == null) {
    if (!options.init)
      throw new Error(`名单文件 ${KNOWN_ISSUES_FILE} 不存在。第一次建名单请加 --init`)
    writeKnown(file, seedKnown(issues))
    log(`[a11y] 已按这次结果建立名单：${issues.size} 条`)
    return { comparison: { added: [], resolved: [], kept: [...issues.keys()].sort() }, ok: true }
  }
  const scanned = new Set()
  for (const slug of new Set(pages.map(page => page.slug))) {
    if (SCHEMES.every(scheme => pages.some(page => page.slug === slug && page.scheme === scheme && page.error == null)))
      scanned.add(slug)
  }
  const comparison = compareWithKnown(issues, known, { scannedSlugs: [...scanned], allSlugs, bothSchemes: options.schemes.length === SCHEMES.length })
  if (options.update && comparison.resolved.length > 0) {
    writeKnown(file, tightenKnown(known, comparison.resolved))
    log(`[a11y] 已从名单删掉 ${comparison.resolved.length} 条不再出现的问题`)
    return { comparison: { ...comparison, resolved: [] }, ok: comparison.added.length === 0 }
  }
  return { comparison, ok: comparison.added.length === 0 && comparison.resolved.length === 0 }
}

async function run(options, origin) {
  const allSlugs = slugsFromMetas(readDemoMetas(ROOT))
  const slugs = selectSlugs(allSlugs, options.only)
  const startedAt = new Date().toISOString()
  let pages = []
  let browser
  const closeBrowser = () => browser?.close().catch(() => {})
  const { chromium } = await import('playwright')
  await withBrowserLock(`a11y-scan ${slugs.length} 页`, async () => {
    browser = await chromium.launch({ headless: true, handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false })
    cleanups.push(closeBrowser)
    try {
      pages = await scanAll(browser, { origin, slugs, schemes: options.schemes, concurrency: options.concurrency })
    }
    finally {
      cleanups.splice(cleanups.indexOf(closeBrowser), 1)
      await closeBrowser()
    }
  }, { timeoutMs: options.lockTimeoutMs, handleSignals: false })
  if (exiting)
    return false

  const { comparison, ok } = reconcile(options, { pages, allSlugs })
  const outDir = resolve(ROOT, options.outDir)
  mkdirSync(outDir, { recursive: true })
  const report = buildReportJson({
    origin,
    include: DEMO_SELECTOR,
    schemes: options.schemes,
    tags: ['全部规则'],
    axeVersion: versionOf('axe-core'),
    startedAt,
    finishedAt: new Date().toISOString(),
  }, pages, comparison)
  writeFileSync(join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  writeFileSync(join(outDir, 'report.md'), buildReportMd(report))
  const s = report.summary
  log(`[a11y] ${s.pages} 页 × ${options.schemes.length} 种模式，违规 ${s.violations} 条；报告：${join(outDir, 'report.md')}`)
  const message = describeComparison(comparison)
  if (message !== '')
    log(message)
  if (s.failedScans.length > 0)
    log(`[a11y] 有 ${s.failedScans.length} 次扫描失败：${s.failedScans.map(f => `${f.slug}/${f.scheme}`).join('、')}`)
  return ok && s.failedScans.length === 0
}

async function main() {
  let options
  try {
    options = parseA11yArgs(process.argv.slice(2))
  }
  catch (error) {
    log(`${error.message}\n\n${USAGE}`)
    process.exit(2)
  }
  if (options.help) {
    console.log(USAGE)
    return
  }
  let server
  const releaseServer = () => server?.release()
  process.on('exit', releaseServer)
  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)
  try {
    let origin = options.oursOrigin ?? `http://localhost:${OURS_PORT}`
    if (options.serve) {
      server = await acquireDocsServer({ root: ROOT, port: OURS_PORT, log })
      cleanups.push(releaseServer)
      origin = server.origin
    }
    process.exitCode = (await run(options, origin)) ? 0 : 1
  }
  catch (error) {
    log(`[a11y] ${error.message}`)
    process.exitCode = 1
  }
  finally {
    releaseServer()
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]))
  main()

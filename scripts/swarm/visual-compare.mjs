#!/usr/bin/env node
/**
 * 视觉对照：把上游官网和我们文档站上同一个组件页按四种组合截图，
 * 拼成「左上游、右我们」的对照图并给出像素差异分数。用法见 scripts/swarm/README.md。
 *
 * 资源纪律：
 * - 先用 HTTP 和文档源文件确认两边的组件页都存在，再起服务、拿锁；组件名拼错时不占用任何资源。
 * - 浏览器通过 browser-lock 拿锁，整台机器最多 2 个；本进程只开 1 个 Chromium，组合按顺序跑。
 * - 文档站端口：--port，否则本工作区登记的槽位端口，否则 5172。同一端口上的服务多个进程共用，最后一个使用者负责关掉。
 * - 正常结束、出错、Ctrl+C 都会关浏览器、关服务、释放锁。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { withBrowserLock } from './browser-lock.mjs'
import { parseVisualArgs, USAGE } from './visual-compare/args.mjs'
import { capturePage } from './visual-compare/capture.mjs'
import { compareImages, sideBySide, VERDICT_TEXT, writePng } from './visual-compare/image.mjs'
import { COMBOS, componentUrls, OURS_PORT, outputPaths, UPSTREAM_ORIGIN } from './visual-compare/names.mjs'
import { preflight } from './visual-compare/preflight.mjs'
import { buildReportJson, buildReportMd, sizeDelta } from './visual-compare/report.mjs'
import { acquireDocsServer } from './visual-compare/serve.mjs'
import { slotPortFor } from './worktree/slots.mjs'

export const TOOL_VERSION = '1.0.0'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(import.meta.url)

function log(message) {
  console.error(message)
}

/** 截一个组合：两边各一张，拼图，按需算分。返回 report 里的一项。 */
async function runCombo(browser, { combo, urls, section, proxy, outDir, name }) {
  const preset = COMBOS[combo]
  const files = outputPaths(outDir, name, combo)
  mkdirSync(files.comboDir, { recursive: true })
  const shots = {}
  for (const site of ['upstream', 'ours']) {
    const context = await browser.newContext({
      viewport: preset.viewport,
      deviceScaleFactor: preset.deviceScaleFactor,
      isMobile: preset.isMobile,
      hasTouch: preset.hasTouch,
      colorScheme: preset.colorScheme,
      reducedMotion: 'reduce',
      locale: 'en-US',
      // 上游走代理，本地文档站直连。
      ...(site === 'upstream' && proxy ? { proxy: { server: proxy } } : {}),
    })
    try {
      shots[site] = await capturePage(context, { site, url: urls[site], scheme: preset.colorScheme, section })
    }
    finally {
      await context.close().catch(() => {})
    }
    writeFileSync(files[site], shots[site].buffer)
  }
  const up = shots.upstream.png
  const ours = shots.ours.png
  const scale = preset.deviceScaleFactor
  writeFileSync(files.sideBySide, writePng(sideBySide(up, ours, {
    leftLabel: `upstream ${combo}`,
    rightLabel: `ours ${combo}`,
    scale,
  })))
  const entry = {
    combo,
    ok: true,
    viewport: preset.viewport,
    deviceScaleFactor: scale,
    colorScheme: preset.colorScheme,
    upstream: { width: up.width, height: up.height, background: shots.upstream.scheme.background },
    ours: { width: ours.width, height: ours.height, background: shots.ours.scheme.background },
    sizeDelta: sizeDelta(up, ours),
    files: { upstream: files.upstream, ours: files.ours, sideBySide: files.sideBySide },
  }
  if (section === 'overview') {
    const result = compareImages(up, ours)
    writeFileSync(files.diff, writePng(result.diff))
    entry.files.diff = files.diff
    entry.score = {
      comparedWidth: result.width,
      comparedHeight: result.height,
      diffPixels: result.diffPixels,
      diffPercent: result.diffPercent,
      contentBox: result.contentBox,
      upstreamContentBox: result.contentBoxes.a,
      oursContentBox: result.contentBoxes.b,
      contentDiffPercent: result.contentDiffPercent,
      verdict: result.verdict,
    }
  }
  return entry
}

/**
 * 收到 SIGINT/SIGTERM 时按登记的倒序执行清理，再退出。
 * 浏览器先登记、后关；锁由 withBrowserLock 的 exit 钩子在最后释放。
 */
const cleanups = []
let exiting = false
function onSignal(signal) {
  if (exiting)
    return
  exiting = true
  log(`[visual] 收到 ${signal}，正在清理`)
  const steps = cleanups.splice(0).reverse()
  steps.reduce((p, fn) => p.then(() => fn()).catch(() => {}), Promise.resolve())
    .finally(() => process.exit(signal === 'SIGINT' ? 130 : 143))
}

function resolveUrls(options, oursOrigin) {
  return componentUrls(options.component, {
    upstreamOrigin: options.upstreamOrigin ?? UPSTREAM_ORIGIN,
    oursOrigin,
  })
}

async function runAll(options, oursOrigin) {
  const { chromium } = await import('playwright')
  const urls = resolveUrls(options, oursOrigin)
  const outDir = resolve(ROOT, options.outDir)
  const startedAt = new Date().toISOString()
  const results = []
  let browser
  const closeBrowser = () => browser?.close().catch(() => {})
  await withBrowserLock(`visual-compare ${urls.name}`, async () => {
    // 信号由本模块统一处理；Playwright 自己的 exit 钩子仍会在进程退出时杀掉浏览器。
    browser = await chromium.launch({ headless: true, handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false })
    cleanups.push(closeBrowser)
    try {
      for (const combo of options.combos) {
        if (exiting)
          return
        log(`[visual] ${urls.name} ${combo} ...`)
        try {
          const entry = await runCombo(browser, { combo, urls, section: options.section, proxy: options.proxy, outDir, name: urls.name })
          results.push(entry)
          log(entry.score
            ? `[visual]   内容区 ${entry.score.contentDiffPercent}% ${VERDICT_TEXT[entry.score.verdict]}（整图 ${entry.score.diffPercent}%），上游 ${entry.upstream.width}×${entry.upstream.height}，我们 ${entry.ours.width}×${entry.ours.height}`
            : `[visual]   完成，上游 ${entry.upstream.width}×${entry.upstream.height}，我们 ${entry.ours.width}×${entry.ours.height}`)
        }
        catch (error) {
          if (exiting)
            return
          log(`[visual]   失败：${error.message}`)
          results.push({ combo, ok: false, error: error.message })
        }
      }
    }
    finally {
      cleanups.splice(cleanups.indexOf(closeBrowser), 1)
      await closeBrowser()
    }
  }, { timeoutMs: options.lockTimeoutMs, handleSignals: false })
  if (exiting)
    return false

  const files = outputPaths(outDir, urls.name)
  mkdirSync(files.componentDir, { recursive: true })
  const report = buildReportJson({
    component: urls.name,
    slug: urls.slug,
    section: options.section,
    urls: { upstream: urls.upstream, ours: urls.ours },
    startedAt,
    finishedAt: new Date().toISOString(),
    toolVersion: TOOL_VERSION,
    playwrightVersion: JSON.parse(readFileSync(require.resolve('playwright/package.json'), 'utf8')).version,
  }, results)
  writeFileSync(files.reportJson, `${JSON.stringify(report, null, 2)}\n`)
  writeFileSync(files.reportMd, buildReportMd(report, files.componentDir))
  log(`[visual] 报告：${files.reportMd}`)
  return results.every(r => r.ok)
}

async function main() {
  let options
  try {
    options = parseVisualArgs(process.argv.slice(2))
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
    const port = options.port ?? slotPortFor(ROOT) ?? OURS_PORT
    let oursOrigin = options.oursOrigin ?? `http://localhost:${port}`
    const check = await preflight({ root: ROOT, urls: resolveUrls(options, oursOrigin), proxy: options.proxy })
    for (const warning of check.warnings)
      log(`[visual] 注意：${warning}`)
    if (check.errors.length > 0) {
      for (const error of check.errors)
        log(`[visual] ${error}`)
      process.exitCode = 1
      return
    }
    if (options.serve) {
      server = await acquireDocsServer({ root: ROOT, port, log })
      cleanups.push(releaseServer)
      oursOrigin = server.origin
    }
    const ok = await runAll(options, oursOrigin)
    process.exitCode = ok ? 0 : 1
  }
  catch (error) {
    log(`[visual] ${error.message}`)
    process.exitCode = 1
  }
  finally {
    releaseServer()
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]))
  main()

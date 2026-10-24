#!/usr/bin/env node
/**
 * CI 上逐个组件跑视觉对照，汇总成 summary.json，给 visual-comment.mjs 写评论用。
 *
 * 流程：
 * 1. 读 changed-components.mjs 的结果（--plan）。
 * 2. 预检：我们的文档页文件在不在、上游页面是不是 404。不在就直接记成「跳过」，不开浏览器。
 * 3. 预检通过的组件里只要有一个，就起一次文档站，所有组件共用，跑完关掉。
 * 4. 每个组件跑一次 visual-compare.mjs（它自己拿浏览器锁）。截图失败的组合写在它的 report.json 里。
 * 5. 写 <out>/summary.json。
 *
 * 退出码：只有对照工具本身崩溃（没写出 report.json）或文档站起不来时返回 1；
 * 组件跳过、组合截图失败都算正常结果，返回 0。
 *
 * 用法：node scripts/swarm/visual-ci.mjs --plan <plan.json> --out <dir> [--port 5172] [--proxy <url> | --no-proxy]
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { REPRESENTATIVE_COMPONENTS } from './changed-components.mjs'
import { componentUrls, OURS_PORT, outputPaths, UPSTREAM_ORIGIN } from './visual-compare/names.mjs'
import { acquireDocsServer } from './visual-compare/serve.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const VISUAL_SCRIPT = join(ROOT, 'scripts/swarm/visual-compare.mjs')
const PREFLIGHT_TIMEOUT_MS = 30_000
const PREFLIGHT_RETRIES = 2

function log(message) {
  console.error(message)
}

/** 我们的文档页源文件。对照工具打开的是 /en/components/<slug>，页面就是这个 index.md。 */
export function oursPageFile(slug, root = ROOT) {
  return join(root, 'apps/docs/docs/en/components', slug, 'index.md')
}

/**
 * 上游页面状态。404 判定为不存在；网络错误重试后仍失败，记成 unreachable。
 * @returns {Promise<{ ok: true } | { ok: false, reason: string }>} 预检结果
 */
export async function checkUpstream(url, { fetchImpl = fetch, retries = PREFLIGHT_RETRIES, timeoutMs = PREFLIGHT_TIMEOUT_MS } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) })
      if (res.status === 404)
        return { ok: false, reason: `上游没有这个页面（HTTP 404）：${url}` }
      if (res.status >= 500 || res.status === 429) {
        lastError = `HTTP ${res.status}`
        continue
      }
      return res.ok ? { ok: true } : { ok: false, reason: `上游页面返回 HTTP ${res.status}：${url}` }
    }
    catch (error) {
      lastError = error.cause?.code ?? error.message
    }
  }
  return { ok: false, reason: `上游页面打不开（${lastError}）：${url}` }
}

/**
 * 预检一个组件。不开浏览器，也不需要文档站。
 * @returns {Promise<{ ok: true, urls: object } | { ok: false, reason: string, urls: object }>} 预检结果
 */
export async function preflight(component, { upstreamOrigin = UPSTREAM_ORIGIN, root = ROOT, fileExists = existsSync, fetchImpl } = {}) {
  const urls = componentUrls(component, { upstreamOrigin })
  if (!fileExists(oursPageFile(urls.slug, root)))
    return { ok: false, urls, reason: `我们的文档站没有这个页面：apps/docs/docs/en/components/${urls.slug}/index.md` }
  const upstream = await checkUpstream(urls.upstream, { fetchImpl })
  return upstream.ok ? { ok: true, urls } : { ok: false, urls, reason: upstream.reason }
}

/** 子进程跑一次 visual-compare.mjs，输出原样转到本进程的 stderr。 */
function runVisual(args) {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [VISUAL_SCRIPT, ...args], { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'] })
    child.on('error', error => resolvePromise({ code: -1, error: error.message }))
    child.on('exit', (code, signal) => resolvePromise({ code: code ?? -1, signal }))
  })
}

function readReport(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  }
  catch {
    return null
  }
}

function parseCiArgs(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      'plan': { type: 'string' },
      'out': { type: 'string', default: 'visual-out' },
      'port': { type: 'string', default: String(OURS_PORT) },
      'proxy': { type: 'string' },
      'no-proxy': { type: 'boolean', default: false },
    },
  })
  if (!values.plan)
    throw new Error('需要 --plan <plan.json>（changed-components.mjs 的输出）')
  const port = Number(values.port)
  if (!Number.isInteger(port) || port <= 0)
    throw new Error(`--port 需要正整数，收到 ${values.port}`)
  return { planFile: resolve(values.plan), outDir: resolve(values.out), port, proxy: values['no-proxy'] ? undefined : values.proxy }
}

/**
 * 预检里的 fetch 也要走代理时，用 Node 自带的全局代理（Node 22.21 / 24.5 起才有，没有就直连）。
 * 本地地址排除在外：同一个进程还要用 fetch 等本地文档站就绪。
 */
async function useProxyForFetch(proxy) {
  if (!proxy)
    return
  const http = await import('node:http')
  if (typeof http.setGlobalProxyFromEnv === 'function')
    http.setGlobalProxyFromEnv({ https_proxy: proxy, http_proxy: proxy, no_proxy: 'localhost,127.0.0.1,::1' })
  else
    log('[visual-ci] 这个 Node 版本不支持全局代理，上游预检会直连')
}

async function main() {
  const options = parseCiArgs(process.argv.slice(2))
  const plan = JSON.parse(readFileSync(options.planFile, 'utf8'))
  mkdirSync(options.outDir, { recursive: true })
  await useProxyForFetch(options.proxy)

  const results = []
  const ready = []
  for (const component of plan.components) {
    const check = await preflight(component)
    if (check.ok) {
      ready.push(check.urls.name)
    }
    else {
      log(`[visual-ci] 跳过 ${component}：${check.reason}`)
      results.push({ component: check.urls.name, status: 'preflight', reason: check.reason })
    }
  }

  let crashed = false
  if (ready.length > 0) {
    let server
    try {
      server = await acquireDocsServer({ root: ROOT, port: options.port, log })
    }
    catch (error) {
      log(`[visual-ci] 文档站起不来：${error.message}`)
      for (const component of ready)
        results.push({ component, status: 'crashed', reason: `文档站起不来：${error.message}` })
      crashed = true
    }
    if (server) {
      const releaseOnSignal = (signal) => {
        server.release()
        process.exit(signal === 'SIGINT' ? 130 : 143)
      }
      process.on('SIGINT', releaseOnSignal)
      process.on('SIGTERM', releaseOnSignal)
      try {
        for (const component of ready) {
          const reportFile = outputPaths(options.outDir, component).reportJson
          rmSync(reportFile, { force: true })
          const args = [component, '--out', options.outDir, '--ours', server.origin]
          args.push(...(options.proxy ? ['--proxy', options.proxy] : ['--no-proxy']))
          log(`[visual-ci] 开始 ${component}`)
          const run = await runVisual(args)
          const report = readReport(reportFile)
          if (report) {
            results.push({ component, status: 'ran', report })
          }
          else {
            crashed = true
            const reason = run.error ?? (run.signal ? `被信号 ${run.signal} 终止` : `退出码 ${run.code}，没有生成 report.json`)
            results.push({ component, status: 'crashed', reason })
          }
        }
      }
      finally {
        server.release()
        process.off('SIGINT', releaseOnSignal)
        process.off('SIGTERM', releaseOnSignal)
      }
    }
  }

  // 保持 plan 里的顺序，评论表格按这个顺序列。
  const order = new Map(plan.components.map((name, i) => [componentUrls(name).name, i]))
  results.sort((a, b) => (order.get(a.component) ?? 0) - (order.get(b.component) ?? 0))
  const summary = { plan, representative: [...REPRESENTATIVE_COMPONENTS], results }
  const summaryFile = join(options.outDir, 'summary.json')
  writeFileSync(summaryFile, `${JSON.stringify(summary, null, 2)}\n`)
  log(`[visual-ci] 汇总：${summaryFile}`)
  process.exitCode = crashed ? 1 : 0
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    log(`[visual-ci] ${error.stack ?? error.message}`)
    process.exitCode = 1
  })
}

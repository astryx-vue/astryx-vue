/**
 * 起服务、拿浏览器锁之前的快速检查：两边的组件页到底存不存在。
 *
 * - 我们这边：看文档源码里有没有 `apps/docs/docs/en/components/<slug>/index.md`（或 `<slug>.md`），不用起服务。
 * - 上游：发一次 HTTP GET，只看状态码。上游走代理时用 HTTP CONNECT 隧道，和浏览器的走法一致。
 *
 * 只有「确定不存在」（我们没有这个文档页，或上游返回 404/410）才算失败。
 * 网络不通、超时这类拿不准的情况只给提示，交给浏览器那一步去报。
 */
import { existsSync } from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import { join } from 'node:path'
import tls from 'node:tls'

export const OURS_DOCS_DIR = 'apps/docs/docs/en/components'
const PROBE_TIMEOUT_MS = 15_000
const MAX_REDIRECTS = 3
const MISSING_STATUS = new Set([404, 410])
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]'])

/** 我们文档站里这个 slug 的页面源文件，不存在时返回 null。 */
export function oursPageFile(root, slug) {
  const candidates = [join(root, OURS_DOCS_DIR, slug, 'index.md'), join(root, OURS_DOCS_DIR, `${slug}.md`)]
  return candidates.find(file => existsSync(file)) ?? null
}

function requestThroughProxy(target, proxy, timeoutMs) {
  return new Promise((resolve, reject) => {
    const connect = http.request({
      host: proxy.hostname,
      port: proxy.port || 80,
      method: 'CONNECT',
      path: `${target.hostname}:${target.port || 443}`,
      timeout: timeoutMs,
    })
    connect.once('connect', (res, socket) => {
      if (res.statusCode !== 200) {
        socket.destroy()
        reject(new Error(`代理拒绝了 CONNECT（HTTP ${res.statusCode}）`))
        return
      }
      const req = https.request(target, {
        method: 'GET',
        timeout: timeoutMs,
        createConnection: () => tls.connect({ socket, servername: target.hostname }),
      }, (response) => {
        response.resume()
        resolve({ status: response.statusCode, location: response.headers.location })
        socket.destroy()
      })
      req.once('timeout', () => req.destroy(new Error('请求超时')))
      req.once('error', reject)
      req.end()
    })
    connect.once('timeout', () => connect.destroy(new Error('连接代理超时')))
    connect.once('error', reject)
    connect.end()
  })
}

function requestDirect(target, proxy, timeoutMs) {
  return new Promise((resolve, reject) => {
    // http 目标走代理时，按 HTTP 代理的规矩把完整 URL 发给代理。
    const options = proxy
      ? { host: proxy.hostname, port: proxy.port || 80, path: target.href, headers: { host: target.host } }
      : { protocol: target.protocol, hostname: target.hostname, port: target.port, path: `${target.pathname}${target.search}` }
    const client = !proxy && target.protocol === 'https:' ? https : http
    const req = client.request({ ...options, method: 'GET', timeout: timeoutMs }, (response) => {
      response.resume()
      resolve({ status: response.statusCode, location: response.headers.location })
      req.destroy()
    })
    req.once('timeout', () => req.destroy(new Error('请求超时')))
    req.once('error', reject)
    req.end()
  })
}

/**
 * 取一个地址的 HTTP 状态码，最多跟 3 次跳转。
 * @param {string} url
 * @param {{ proxy?: string, timeoutMs?: number }} options proxy 是 http:// 代理地址
 * @returns {Promise<number>} 最终的状态码
 */
export async function probeStatus(url, { proxy, timeoutMs = PROBE_TIMEOUT_MS } = {}) {
  let target = new URL(url)
  for (let hop = 0; ; hop++) {
    // 和浏览器一样，本机地址不走代理。
    const proxyUrl = proxy && !LOOPBACK.has(target.hostname) ? new URL(proxy) : null
    const { status, location } = target.protocol === 'https:' && proxyUrl
      ? await requestThroughProxy(target, proxyUrl, timeoutMs)
      : await requestDirect(target, proxyUrl, timeoutMs)
    if (status >= 300 && status < 400 && location && hop < MAX_REDIRECTS) {
      target = new URL(location, target)
      continue
    }
    return status
  }
}

/**
 * 检查两边页面。返回 { errors, warnings }，errors 不为空时不该再起服务和开浏览器。
 * @param {{ root: string, urls: { name: string, slug: string, upstream: string }, proxy?: string,
 *   probe?: typeof probeStatus }} options probe 可以在测试里换成假的
 */
export async function preflight({ root, urls, proxy, probe = probeStatus }) {
  const errors = []
  const warnings = []
  if (!oursPageFile(root, urls.slug))
    errors.push(`我们的文档站没有 ${urls.slug} 这个组件页（${OURS_DOCS_DIR}/${urls.slug}/index.md 不存在）。看看组件名是不是拼错了`)
  try {
    const status = await probe(urls.upstream, { proxy })
    if (MISSING_STATUS.has(status))
      errors.push(`上游没有 ${urls.name} 这个组件页（HTTP ${status}：${urls.upstream}）。看看组件名是不是拼错了`)
    else if (status >= 400)
      warnings.push(`上游页面返回 HTTP ${status}，先继续，浏览器那一步可能会失败：${urls.upstream}`)
  }
  catch (error) {
    warnings.push(`没能预先访问上游页面（${error.message}），先继续：${urls.upstream}`)
  }
  return { errors, warnings }
}

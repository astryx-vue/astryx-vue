/**
 * 导航地址的协议检查。
 *
 * 拦下 `javascript:`、`vbscript:` 和会当成页面打开的 `data:text/html`。
 * 通过的字符串原样返回，不去掉调用方自己写的空白以外的内容。
 * 图片、样式这类嵌入资源不走这里。
 */

function normalizeUrl(url: string): string {
  // eslint-disable-next-line no-control-regex -- 浏览器会忽略这些控制字符，检查前先拿掉
  return url.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

/** 协议比较用的形式：小写，并去掉协议冒号后面的空格。`data: text/html` 仍是 HTML。 */
function comparableUrl(normalized: string): string {
  return normalized.toLowerCase().replace(/^([a-z][a-z\d+.-]*:) +/, '$1')
}

/** 规范化后的导航地址。危险协议返回 null。 */
export function sanitizeUrl(url: string): string | null {
  const normalized = normalizeUrl(url)
  const lower = comparableUrl(normalized)
  if (
    lower.startsWith('javascript:')
    || lower.startsWith('vbscript:')
    || lower.startsWith('data:text/html')
  ) {
    return null
  }
  return normalized
}

/** 只判断，不改写调用方要交给浏览器的那个字符串。 */
export function isSafeUrl(url: string): boolean {
  return sanitizeUrl(url) !== null
}

/**
 * 检查字符串，以及带 pathname / href / protocol 的路由对象。
 * 空地址算安全（调用方本来就没有目的地）。不是字符串也不是对象的值算不安全。
 */
export function isSafeDestination(destination: unknown): boolean {
  if (destination == null)
    return true
  if (typeof destination === 'string')
    return isSafeUrl(destination)
  if (typeof destination !== 'object')
    return false

  const { pathname, href, protocol, host, hostname } = destination as {
    pathname?: unknown
    href?: unknown
    protocol?: unknown
    host?: unknown
    hostname?: unknown
  }

  for (const field of [pathname, href, protocol, host, hostname]) {
    if (field != null && typeof field !== 'string')
      return false
  }
  if (typeof pathname === 'string' && !isSafeUrl(pathname))
    return false
  if (typeof href === 'string' && !isSafeUrl(href))
    return false
  if (typeof protocol === 'string' && protocol !== '') {
    const normalizedProtocol = normalizeUrl(protocol)
    const prefix = normalizedProtocol.endsWith(':')
      ? normalizedProtocol
      : `${normalizedProtocol}:`
    if (!isSafeUrl(prefix))
      return false
    const body = (host || hostname || '') as string
    const path = typeof pathname === 'string' ? pathname : ''
    if (!isSafeUrl(`${prefix}${body}${path}`))
      return false
  }
  return true
}

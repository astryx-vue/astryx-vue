function normalizeUrl(url: string): string {
  let result = ''
  for (let index = 0; index < url.length; index += 1) {
    const code = url.charCodeAt(index)
    if (code <= 0x1F || code === 0x7F)
      continue
    result += url[index]
  }
  return result.trim()
}

/** Lower-case the scheme and drop the spaces a browser ignores after `:`. */
function comparableUrl(normalized: string): string {
  return normalized.toLowerCase().replace(/^([a-z][a-z\d+.-]*:) +/, '$1')
}

function isBlockedNavigation(url: string): boolean {
  return url.startsWith('javascript:') || url.startsWith('vbscript:') || url.startsWith('data:text/html')
}

/**
 * Navigation target with control characters removed.
 * `javascript:`, `vbscript:`, and HTML `data:` URLs are dropped.
 */
export function sanitizeMarkdownLinkUrl(url: string): string | null {
  const normalized = normalizeUrl(url)
  if (normalized === '' || isBlockedNavigation(comparableUrl(normalized)))
    return null
  return normalized
}

/**
 * Image target. `data:` is rejected outright so an SVG payload cannot run.
 */
export function sanitizeMarkdownImageUrl(url: string): string | null {
  const normalized = normalizeUrl(url)
  if (normalized === '')
    return null
  const comparable = comparableUrl(normalized)
  if (comparable.startsWith('javascript:') || comparable.startsWith('vbscript:') || comparable.startsWith('data:'))
    return null
  return normalized
}

export function linkOpensInNewTab(url: string): boolean {
  return /^https?:/i.test(url)
}

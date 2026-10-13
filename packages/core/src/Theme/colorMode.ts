export type ResolvedColorMode = 'light' | 'dark'

/**
 * Split `light-dark(light, dark)` at the top-level comma.
 * Nested functions such as `rgb()` keep their own commas.
 */
function splitLightDark(value: string): readonly [string, string] | null {
  const trimmed = value.trim()
  const prefix = 'light-dark('
  if (!trimmed.startsWith(prefix) || !trimmed.endsWith(')'))
    return null

  const body = trimmed.slice(prefix.length, -1)
  let depth = 0
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index]
    if (char === '(') {
      depth += 1
    }
    else if (char === ')') {
      depth -= 1
    }
    else if (char === ',' && depth === 0) {
      const light = body.slice(0, index).trim()
      const dark = body.slice(index + 1).trim()
      return light && dark ? [light, dark] : null
    }
  }
  return null
}

/**
 * Pick the stop `light-dark()` would use for the effective mode.
 * A value that is not `light-dark()` is returned unchanged.
 */
export function resolveLightDark(value: string, mode: ResolvedColorMode): string {
  const parts = splitLightDark(value)
  if (!parts)
    return value.trim()
  return mode === 'dark' ? parts[1] : parts[0]
}

/**
 * The mode `light-dark()` is using on the page.
 *
 * An explicit theme mode is handled by the caller. This reads the document
 * attribute, the docs site's `dark` class, then the OS preference that was
 * already measured.
 */
export function readColorMode(prefersDark: boolean): ResolvedColorMode {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-astryx-color-mode')
    if (attr === 'light' || attr === 'dark')
      return attr
    if (document.documentElement.classList.contains('dark'))
      return 'dark'
  }
  return prefersDark ? 'dark' : 'light'
}

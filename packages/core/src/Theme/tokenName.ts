const THEME_TOKEN_PREFIX = /^--(?:color|font|text|radius|duration|ease|spacing|size|shadow|border|focus|heading)-/

/** Accept `--color-accent`, `--astryx-color-accent`, or `color-accent`. */
export function normalizeTokenName(name: string): string {
  const trimmed = name.trim()
  if (trimmed.startsWith('--astryx-'))
    return trimmed
  if (trimmed.startsWith('--'))
    return `--astryx-${trimmed.slice(2)}`
  return `--astryx-${trimmed}`
}

/**
 * Rewrite `var(--color-accent)` to `var(--astryx-color-accent)`.
 *
 * Custom properties outside the theme vocabulary are left alone.
 */
export function prefixTokenReferences(value: string): string {
  return value.replace(/var\(\s*(--(?!astryx-)[\w-]+)/g, (match, name: string) => {
    if (!THEME_TOKEN_PREFIX.test(name))
      return match
    return `var(${normalizeTokenName(name)}`
  })
}

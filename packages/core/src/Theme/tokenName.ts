/** Unprefixed theme vocabulary: `--color-accent`, `--spacing-4`, `--font-size-base`. */
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
 * Whether a custom-property name belongs to the shared theme vocabulary,
 * written either way: `--color-accent` or `--astryx-color-accent`.
 *
 * A theme-local token may not use one of these names, because the shared
 * name already has a meaning every component reads.
 */
export function isPortableTokenName(name: string): boolean {
  const trimmed = name.trim()
  const bare = trimmed.startsWith('--astryx-') ? `--${trimmed.slice('--astryx-'.length)}` : trimmed
  return THEME_TOKEN_PREFIX.test(bare)
}

/**
 * Rewrite `var(--color-accent)` to `var(--astryx-color-accent)`.
 *
 * Custom properties outside the theme vocabulary are left alone, so a
 * theme-local `var(--brand-ink)` keeps its exact name.
 */
export function prefixTokenReferences(value: string): string {
  return value.replace(/var\(\s*(--(?!astryx-)[\w-]+)/g, (match, name: string) => {
    if (!THEME_TOKEN_PREFIX.test(name))
      return match
    return `var(${normalizeTokenName(name)}`
  })
}

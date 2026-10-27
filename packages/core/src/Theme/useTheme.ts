import type { ComputedRef } from 'vue'
import type { ResolvedColorMode } from './colorMode.js'
import { computed, inject } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { readColorMode, resolveLightDark } from './colorMode.js'
import { themeContextKey } from './context.js'
import { DATA_TOKEN_DEFAULTS } from './dataTokens.js'
import { normalizeTokenName } from './tokenName.js'

export interface UseThemeReturn {
  /** Name of the nearest theme, or `neutral` when no theme is present. */
  name: ComputedRef<string>
  /** Effective light or dark mode. `system` is resolved. */
  mode: ComputedRef<ResolvedColorMode>
  /** Resolve one token for the effective mode. */
  token: (name: string) => string
  /** Tokens declared by the nearest theme, resolved for the effective mode. */
  tokens: ComputedRef<Record<string, string>>
}

/** Prefixed data-color defaults, for reads outside a stylesheet. */
const DATA_DEFAULTS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(DATA_TOKEN_DEFAULTS).map(([name, value]) => [normalizeTokenName(name), value]),
)

function readDocumentToken(name: string, mode: ResolvedColorMode): string {
  if (typeof document === 'undefined')
    return ''
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return raw ? resolveLightDark(raw, mode) : ''
}

/**
 * Read the nearest theme. Outside a `Theme`, the name is `neutral` and tokens
 * are read from the document's custom properties.
 *
 * Values are the theme's root values. An adaptation rule that changes a token
 * on narrow or touch screens applies through CSS only, so `token()` and
 * `tokens` stay the same across environments.
 *
 * The returned object and `token` are created once per component. `name`,
 * `mode`, and `tokens` update only when the theme or the effective mode
 * changes, so watching them does not trigger on unrelated renders.
 */
export function useTheme(): UseThemeReturn {
  const context = inject(themeContextKey, null)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const mode = computed<ResolvedColorMode>(() => {
    const requested = context?.value.mode
    if (requested === 'light' || requested === 'dark')
      return requested
    return readColorMode(prefersDark.value)
  })

  const theme = computed(() => context?.value.theme)
  const name = computed(() => theme.value?.name ?? 'neutral')

  const tokens = computed(() => {
    const resolved: Record<string, string> = {}
    const source = theme.value
    for (const [key, value] of Object.entries({ ...source?.tokens, ...source?.localTokens }))
      resolved[key] = resolveLightDark(value, mode.value)
    return resolved
  })

  function token(tokenName: string): string {
    const trimmed = tokenName.trim()
    const local = tokens.value[trimmed]
    if (local !== undefined)
      return local
    const key = normalizeTokenName(trimmed)
    const fallback = DATA_DEFAULTS[key]
    return tokens.value[key]
      || readDocumentToken(key, mode.value)
      || (fallback ? resolveLightDark(fallback, mode.value) : '')
  }

  return { name, mode, token, tokens }
}

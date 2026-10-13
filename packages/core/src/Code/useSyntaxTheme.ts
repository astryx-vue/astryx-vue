import type { ComputedRef } from 'vue'
import type { SyntaxThemeTokens, SyntaxTokenKey } from './syntaxTheme.js'
import { computed, inject } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { readColorMode, resolveLightDark } from '../Theme/colorMode.js'
import { themeContextKey } from '../Theme/context.js'
import { syntaxThemeKey } from './syntaxContext.js'
import { SYNTAX_TOKEN_KEYS } from './syntaxTheme.js'

export interface UseSyntaxThemeReturn {
  /** Syntax theme name. Empty when the provider has no theme. */
  name: ComputedRef<string>
  /** Mode used to pick a `light-dark()` stop. */
  mode: ComputedRef<'light' | 'dark'>
  /** One syntax token for the effective mode. */
  token: (name: SyntaxTokenKey) => string
  /** Every syntax token for the effective mode, or null when no theme applies. */
  tokens: ComputedRef<SyntaxThemeTokens | null>
}

/**
 * Read the nearest SyntaxTheme, or the syntax field of the nearest Theme.
 * Returns null when neither is present.
 */
export function useSyntaxTheme(): UseSyntaxThemeReturn | null {
  const injected = inject(syntaxThemeKey, null)
  const theme = inject(themeContextKey, null)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  if (!injected)
    return null

  const mode = computed(() => {
    const requested = theme?.value.mode
    if (requested === 'light' || requested === 'dark')
      return requested
    return readColorMode(prefersDark.value)
  })
  const name = computed(() => injected.value?.name ?? '')
  const tokens = computed<SyntaxThemeTokens | null>(() => {
    const theme = injected.value
    if (!theme)
      return null
    const resolved = {} as SyntaxThemeTokens
    for (const key of SYNTAX_TOKEN_KEYS)
      resolved[key] = resolveLightDark(theme.tokens[key], mode.value)
    return resolved
  })

  function token(tokenName: SyntaxTokenKey): string {
    return tokens.value?.[tokenName] ?? ''
  }

  return { name, mode, token, tokens }
}

import type { ComputedRef } from 'vue'
import type { ResolvedColorMode } from './colorMode.js'
import { computed, inject } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { readColorMode, resolveLightDark } from './colorMode.js'
import { themeContextKey } from './context.js'
import { normalizeTokenName } from './defineTheme.js'

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

function readDocumentToken(name: string, mode: ResolvedColorMode): string {
  if (typeof document === 'undefined')
    return ''
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return raw ? resolveLightDark(raw, mode) : ''
}

/**
 * Read the nearest theme. Outside a `Theme`, the name is `neutral` and tokens
 * are read from the document's custom properties.
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

  const name = computed(() => context?.value.theme.name ?? 'neutral')

  const tokens = computed(() => {
    const source = context?.value.theme.tokens ?? {}
    const resolved: Record<string, string> = {}
    for (const [key, value] of Object.entries(source))
      resolved[key] = resolveLightDark(value, mode.value)
    return resolved
  })

  function token(tokenName: string): string {
    const key = normalizeTokenName(tokenName)
    return tokens.value[key] ?? readDocumentToken(key, mode.value)
  }

  return { name, mode, token, tokens }
}

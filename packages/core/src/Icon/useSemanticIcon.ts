import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, inject, toValue } from 'vue'
import { themeContextKey } from '../Theme/context.js'
import { resolveSemanticIcon } from './semantic.js'

/**
 * The Iconify id for a semantic icon name, from the nearest theme.
 *
 * Returns undefined when the name is not a semantic icon and the theme does
 * not map it. Callers then keep the built-in glyph or a CSS class.
 */
export function useSemanticIcon(name: MaybeRefOrGetter<string | undefined>): ComputedRef<string | undefined> {
  const context = inject(themeContextKey, null)
  return computed(() => resolveSemanticIcon(toValue(name), context?.value.theme.icons))
}

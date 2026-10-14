import type { ComputedRef } from 'vue'
import type { CoreIndicatorName, IndicatorComponent } from './types.js'
import { computed, inject } from 'vue'
import { themeContextKey } from '../Theme/context.js'
import { getIndicator } from './registry.js'

/**
 * The indicator graphic from the nearest theme.
 *
 * A core name always resolves. Any other name resolves only when that theme
 * supplies a component.
 */
export function useIndicator<N extends CoreIndicatorName>(name: N): ComputedRef<IndicatorComponent>
export function useIndicator(name: string): ComputedRef<IndicatorComponent | undefined>
export function useIndicator(name: string): ComputedRef<IndicatorComponent | undefined> {
  const context = inject(themeContextKey, null)
  return computed(() => getIndicator(name, context?.value.theme))
}

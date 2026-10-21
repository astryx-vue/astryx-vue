import type { ComputedRef, MaybeRef } from 'vue'
import type { IconSize } from './types.js'
import { computed, provide, toValue } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

/**
 * The size an owning component supplies to the icons in its slots.
 *
 * The value is stored as given, so a caller can pass a ref or a computed and
 * keep the default in step with its own props.
 */
export const ICON_DEFAULT_SIZE_KEY = defineLayerScopedKey<MaybeRef<IconSize> | undefined>(
  'astryx-icon-default-size',
  undefined,
)

/**
 * Let the icons inside a component follow that component's own size.
 *
 * Call it in the component's setup with a ref or computed so the inherited size
 * stays reactive.
 */
export function provideIconSize(size: MaybeRef<IconSize>): void {
  provide(ICON_DEFAULT_SIZE_KEY, size)
}

/**
 * The size inherited from the nearest owner, or `undefined` when there is none.
 */
export function useIconDefaultSize(): ComputedRef<IconSize | undefined> {
  const inherited = readLayerScoped(ICON_DEFAULT_SIZE_KEY)
  return computed(() => (inherited == null ? undefined : toValue(inherited)))
}

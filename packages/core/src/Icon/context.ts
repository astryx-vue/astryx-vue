import type { ComputedRef, InjectionKey, MaybeRef } from 'vue'
import type { IconSize } from './types.js'
import { computed, inject, provide, toValue } from 'vue'

/**
 * The size an owning component supplies to the icons in its slots.
 *
 * The value is stored as given, so a caller can pass a ref or a computed and
 * keep the default in step with its own props.
 */
export const ICON_DEFAULT_SIZE_KEY: InjectionKey<MaybeRef<IconSize>> = Symbol('astryx-icon-default-size')

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
  const inherited = inject(ICON_DEFAULT_SIZE_KEY, undefined)
  return computed(() => (inherited == null ? undefined : toValue(inherited)))
}

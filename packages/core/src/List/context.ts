import type { ComputedRef, InjectionKey } from 'vue'
import type { ListDensity, ListEdgeCompensation, ListMarkerStyle } from './types.js'
import { computed, inject } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

/**
 * What a `List` tells the rows inside it.
 *
 * Every member is a computed ref, so a row that reads the context keeps
 * following the list's props after mount instead of freezing at the values
 * present when the list was created.
 */
export interface ListContextValue {
  density: ComputedRef<ListDensity>
  hasDividers: ComputedRef<boolean>
  listStyle: ComputedRef<ListMarkerStyle>
  edgeCompensation: ComputedRef<ListEdgeCompensation | undefined>
}

export const listContextKey = defineLayerScopedKey<ListContextValue | undefined>('astryx-list-context', undefined)

/** The surrounding list, or `undefined` when the row stands alone. */
export function useListContext(): ListContextValue | undefined {
  return readLayerScoped(listContextKey)
}

export const itemDescriptionContextKey: InjectionKey<ComputedRef<string | null>> = Symbol('astryx-item-description')

/**
 * The id of the description element of the nearest row, so a control rendered
 * in one of that row's slots can point `aria-describedby` at it. `null` when
 * the row renders no description.
 */
export function useItemDescriptionId(): ComputedRef<string | null> {
  return inject(itemDescriptionContextKey, computed(() => null))
}

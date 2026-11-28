import type { ComputedRef, InjectionKey } from 'vue'
import type { ListReorderContextValue } from './reorder/reorderTypes.js'
import type { ListDensity, ListEdge, ListEdgeCompensation, ListMarkerStyle } from './types.js'
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
  /** The resolved row edge treatment; the deprecated prop resolves into it. */
  edge: ComputedRef<ListEdge>
  hasDividers: ComputedRef<boolean>
  listStyle: ComputedRef<ListMarkerStyle>
  /** @deprecated Use `edge`, which it resolves into. */
  edgeCompensation: ComputedRef<ListEdgeCompensation | undefined>
  /** The list's reorder session and options, or `null` when it has no `reorderable`. */
  reorder: ComputedRef<ListReorderContextValue | null>
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

/**
 * `ListItem` 直接渲染的那一行读到它。链接行的内边距和热区点按转给里面的链接，
 * 行里的内容（插槽里的嵌套行）读到的是 `null`。
 */
export const itemListRowKey = defineLayerScopedKey<ItemListRow | null>('astryx-item-list-row', null)

export interface ItemListRow {
  /** 行在有序列表里，标记是数字。 */
  isNumbered: ComputedRef<boolean>
}

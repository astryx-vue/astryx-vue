/**
 * @file itemSlots.ts
 * @input Nothing but Vue's injection API
 * @output What a row's wrapper (ListItem) hands the Item it renders, and what
 *   Item hands its own content: the trailing child after the row's content
 *   (`itemTrailingKey`), whether the label needs an id (`itemLabelNeededKey`)
 *   and that id (`itemLabelIdKey`)
 * @position List internals. A reorderable ListItem puts its handle at the
 *   end of a row without end content and names it after the row's label.
 *   Item reads the first two once and gives its content `null` and `false`,
 *   so a row nested in its slots starts clean
 */
import type { ComputedRef, InjectionKey, VNodeChild } from 'vue'
import { computed, inject, provide } from 'vue'

/** Renders the row's own last child, after its content and end slot. */
export const itemTrailingKey: InjectionKey<ComputedRef<(() => VNodeChild) | null>> = Symbol('astryx-item-trailing')

/** The row's label needs an id: something names itself after it. */
export const itemLabelNeededKey: InjectionKey<ComputedRef<boolean>> = Symbol('astryx-item-label-needed')

/** The id of the row's label element, or `null` when it renders none or needs none. */
export const itemLabelIdKey: InjectionKey<ComputedRef<string | null>> = Symbol('astryx-item-label-id')

const NONE = computed(() => null)
const NOT_NEEDED = computed(() => false)

/** The id of the nearest row's label element, when the row gave it one. */
export function useItemLabelId(): ComputedRef<string | null> {
  return inject(itemLabelIdKey, NONE)
}

/**
 * Item's side: reads what its wrapper handed it, then hands its own content
 * nothing and its label's id.
 */
export function useItemSlotsFromWrapper(
  labelId: string,
  hasLabel: ComputedRef<boolean>,
): { trailing: ComputedRef<(() => VNodeChild) | null>, shownLabelId: ComputedRef<string | null> } {
  const trailing = inject(itemTrailingKey, NONE)
  const isLabelNeeded = inject(itemLabelNeededKey, NOT_NEEDED)
  const shownLabelId = computed(() => (isLabelNeeded.value && hasLabel.value ? labelId : null))
  provide(itemTrailingKey, NONE)
  provide(itemLabelNeededKey, NOT_NEEDED)
  provide(itemLabelIdKey, shownLabelId)
  return { trailing, shownLabelId }
}

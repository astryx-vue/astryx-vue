import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export type LayoutArea = 'header' | 'start' | 'content' | 'end' | 'footer'
export type LayoutHeight = 'fill' | 'auto'

export interface LayoutSlotsState {
  hasHeader: boolean
  hasFooter: boolean
  hasStart: boolean
  hasEnd: boolean
}

/** 没有任何 `Layout` 时的槽位状态：都没有。 */
export const emptyLayoutSlots = computed<LayoutSlotsState>(() => ({
  hasHeader: false,
  hasFooter: false,
  hasStart: false,
  hasEnd: false,
}))

const NO_LAYOUT_AREA = computed<LayoutArea | null>(() => null)
const NO_LAYOUT_DIVIDERS = computed<boolean | undefined>(() => undefined)

export const layoutSlotsKey = defineLayerScopedKey('astryx-layout-slots', emptyLayoutSlots)
export const layoutAreaKey = defineLayerScopedKey('astryx-layout-area', NO_LAYOUT_AREA)
export const layoutDividerKey = defineLayerScopedKey('astryx-layout-dividers', NO_LAYOUT_DIVIDERS)

export function useLayoutSlots(): ComputedRef<LayoutSlotsState> {
  return readLayerScoped(layoutSlotsKey)
}

export function useLayoutArea(): ComputedRef<LayoutArea | null> {
  return readLayerScoped(layoutAreaKey)
}

export function useLayoutDividers(): ComputedRef<boolean | undefined> {
  return readLayerScoped(layoutDividerKey)
}

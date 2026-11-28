import type { ComputedRef } from 'vue'
import { computed, provide } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export type LayoutArea = 'header' | 'start' | 'content' | 'end' | 'footer'
export type LayoutHeight = 'fill' | 'auto'

/** A container that names itself to the Layout inside it. */
export type LayoutContainer = 'card' | 'dialog' | 'bottom-sheet'

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

/**
 * The container a Layout sits in. Card, Dialog, and BottomSheet provide it;
 * LayoutHeader and LayoutFooter reflect it as `data-container`, so a theme
 * can style a dialog's header without a card's. A new layer resets it.
 */
export const layoutContainerKey = defineLayerScopedKey<LayoutContainer | null>('astryx-layout-container', null)

export function provideLayoutContainer(container: LayoutContainer): void {
  provide(layoutContainerKey, container)
}

export function useLayoutContainer(): LayoutContainer | null {
  return readLayerScoped(layoutContainerKey)
}

export function useLayoutSlots(): ComputedRef<LayoutSlotsState> {
  return readLayerScoped(layoutSlotsKey)
}

export function useLayoutArea(): ComputedRef<LayoutArea | null> {
  return readLayerScoped(layoutAreaKey)
}

export function useLayoutDividers(): ComputedRef<boolean | undefined> {
  return readLayerScoped(layoutDividerKey)
}

import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject } from 'vue'

export type LayoutArea = 'header' | 'start' | 'content' | 'end' | 'footer'
export type LayoutHeight = 'fill' | 'auto'

export interface LayoutSlotsState {
  hasHeader: boolean
  hasFooter: boolean
  hasStart: boolean
  hasEnd: boolean
}

export const layoutSlotsKey: InjectionKey<ComputedRef<LayoutSlotsState>> = Symbol('astryx-layout-slots')
export const layoutAreaKey: InjectionKey<ComputedRef<LayoutArea | null>> = Symbol('astryx-layout-area')
export const layoutDividerKey: InjectionKey<ComputedRef<boolean | undefined>> = Symbol('astryx-layout-dividers')

const emptySlots = computed<LayoutSlotsState>(() => ({
  hasHeader: false,
  hasFooter: false,
  hasStart: false,
  hasEnd: false,
}))

export function useLayoutSlots(): ComputedRef<LayoutSlotsState> {
  return inject(layoutSlotsKey, emptySlots)
}

export function useLayoutArea(): ComputedRef<LayoutArea | null> {
  return inject(layoutAreaKey, computed<LayoutArea | null>(() => null))
}

export function useLayoutDividers(): ComputedRef<boolean | undefined> {
  return inject(layoutDividerKey, computed(() => undefined))
}

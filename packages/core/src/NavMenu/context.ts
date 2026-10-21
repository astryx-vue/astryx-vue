import type { InjectionKey, Ref } from 'vue'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export type NavMenuSize = 'sm' | 'md' | 'lg'
export type NavMenuFocusRequest = 'first' | 'last' | null

export interface NavMenuContextValue {
  size: Ref<NavMenuSize>
  close: () => void
}

export const navMenuKey = defineLayerScopedKey<NavMenuContextValue | null>('astryx-nav-menu', null)
export const navMenuCloseKey: InjectionKey<() => void> = Symbol('astryx-nav-menu-close')
/** 弹出层要求菜单把焦点放在哪一项。菜单可以自己收，调用方也可以用插槽参数盖过它。 */
export const navMenuFocusKey: InjectionKey<Ref<NavMenuFocusRequest>> = Symbol('astryx-nav-menu-focus')

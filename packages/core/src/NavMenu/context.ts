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

/**
 * 在顶栏菜单里，选中一项后要不要关闭菜单。由 TopNavMenu、TopNavMegaMenu 提供；
 * 没人提供时项照常在选中后关闭。
 */
export const navMenuPickKey: InjectionKey<() => boolean> = Symbol('astryx-nav-menu-pick')

/** 弹出层的名字（标题文字）。里面没有自己命名的菜单用它当名字，一个弹出层里只有这一个具名菜单。 */
export const navMenuLabelKey: InjectionKey<Ref<string | undefined>> = Symbol('astryx-nav-menu-label')

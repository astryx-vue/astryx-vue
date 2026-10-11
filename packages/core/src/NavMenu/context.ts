import type { InjectionKey, Ref } from 'vue'

export type NavMenuSize = 'sm' | 'md' | 'lg'
export type NavMenuFocusRequest = 'first' | 'last' | null

export interface NavMenuContextValue {
  size: Ref<NavMenuSize>
  close: () => void
}

export const navMenuKey: InjectionKey<NavMenuContextValue> = Symbol('astryx-nav-menu')
export const navMenuCloseKey: InjectionKey<() => void> = Symbol('astryx-nav-menu-close')

import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export interface AppShellMobile {
  isMobile: boolean
  isMobileNavOpen: boolean
  mobileNavId?: string
  isMobileNavEnabled: boolean
  hasAutoToggle: boolean
  hasSideNav: boolean
  toggleMobileNav: () => void
  openMobileNav: () => void
  closeMobileNav: () => void
}

export const appShellMobileKey: InjectionKey<AppShellMobile> = Symbol('astryx-app-shell-mobile')

const fallback: AppShellMobile = {
  isMobile: false,
  isMobileNavOpen: false,
  isMobileNavEnabled: false,
  hasAutoToggle: true,
  hasSideNav: false,
  toggleMobileNav: () => {},
  openMobileNav: () => {},
  closeMobileNav: () => {},
}

/** 外壳外面、或者关掉了移动导航时，返回一组不会做事的默认值。 */
export function useAppShellMobile(): AppShellMobile {
  return inject(appShellMobileKey, fallback)
}

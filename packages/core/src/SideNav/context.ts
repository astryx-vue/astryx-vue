import type { InjectionKey, Ref } from 'vue'
import { inject, ref } from 'vue'

export interface SideNavCollapseContext {
  isCollapsed: Ref<boolean>
  isCollapsible: Ref<boolean>
  toggle: () => void
  navId: string
}

export const sideNavCollapseKey: InjectionKey<SideNavCollapseContext> = Symbol('astryx-side-nav-collapse')

const fallbackCollapsed = ref(false)
const fallbackCollapsible = ref(false)

const fallbackCollapse: SideNavCollapseContext = {
  isCollapsed: fallbackCollapsed,
  isCollapsible: fallbackCollapsible,
  navId: '',
  toggle: () => {},
}

export function useSideNavCollapse(): SideNavCollapseContext {
  return inject(sideNavCollapseKey, fallbackCollapse)
}

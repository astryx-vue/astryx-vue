import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { computed, inject, ref } from 'vue'

export type SideNavRenderMode = 'default' | 'topbar' | 'drawer' | 'drawer-content'

export const sideNavRenderModeKey: InjectionKey<ComputedRef<SideNavRenderMode>> = Symbol('astryx-side-nav-render-mode')

const defaultRenderMode = computed<SideNavRenderMode>(() => 'default')

export function useSideNavRenderMode(): ComputedRef<SideNavRenderMode> {
  return inject(sideNavRenderModeKey, defaultRenderMode)
}

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

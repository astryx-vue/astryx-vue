import type { InjectionKey, Ref } from 'vue'
import type { BottomSheetPurpose } from './types.js'

export interface BottomSheetRegistration {
  getElement: () => HTMLElement | null
  label: () => string
  purpose: () => BottomSheetPurpose
}

export interface BottomSheetSwitcherContext {
  activeId: Ref<string | null>
  retainedId: Ref<string | null>
  alignmentOffset: Ref<number>
  setActive: (id: string | null) => void
  register: (id: string, registration: BottomSheetRegistration) => void
  unregister: (id: string) => void
}

export const bottomSheetSwitcherKey: InjectionKey<BottomSheetSwitcherContext> = Symbol('astryx-bottom-sheet-switcher')

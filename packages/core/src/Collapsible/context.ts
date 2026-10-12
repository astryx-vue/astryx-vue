import type { ComputedRef, InjectionKey } from 'vue'

export type CollapsibleGroupDensity = 'compact' | 'balanced' | 'spacious'
export type CollapsibleGroupType = 'single' | 'multiple'
export type CollapsibleGroupValue = string | string[]

export interface CollapsibleGroupContextValue {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

export interface CollapsibleGroupPresentation {
  hasDividers: ComputedRef<boolean>
  density: ComputedRef<CollapsibleGroupDensity | null>
}

export const collapsibleGroupKey: InjectionKey<CollapsibleGroupContextValue> = Symbol('collapsibleGroup')
export const collapsibleGroupPresentationKey: InjectionKey<CollapsibleGroupPresentation> = Symbol('collapsibleGroupPresentation')

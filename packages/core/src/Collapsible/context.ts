import type { ComputedRef } from 'vue'
import type { CollapsibleChevronPosition } from './types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

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
  chevronPosition: ComputedRef<CollapsibleChevronPosition>
}

export const collapsibleGroupKey = defineLayerScopedKey<CollapsibleGroupContextValue | null>('collapsibleGroup', null)
export const collapsibleGroupPresentationKey = defineLayerScopedKey<CollapsibleGroupPresentation | null>(
  'collapsibleGroupPresentation',
  null,
)

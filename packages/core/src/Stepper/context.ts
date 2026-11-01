import type { ComputedRef } from 'vue'
import type { StepIndicator, StepperDensity, StepperIndicatorPosition, StepperOrientation, StepStatus } from './types.js'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export interface StepRegistration {
  step: number
  label: string
  description?: string
  indicator: StepIndicator
  status?: StepStatus
  isDisabled: boolean
}

export interface StepperContextValue {
  activeStep: ComputedRef<number>
  /** 切换到当前步骤之前所在的步骤。进度条用它判断这次是不是只前进了一步。 */
  previousActiveStep: ComputedRef<number>
  orientation: ComputedRef<StepperOrientation>
  density: ComputedRef<StepperDensity>
  indicatorPosition: ComputedRef<StepperIndicatorPosition>
  isNonLinear: ComputedRef<boolean>
  hasCollapsibleLabels: ComputedRef<boolean>
  collapsed: ComputedRef<boolean>
  select: ComputedRef<((index: number) => void) | null>
  register: (record: StepRegistration) => void
  unregister: (step: number) => void
}

export const stepperContextKey = defineLayerScopedKey<StepperContextValue | null>('stepper', null)

/**
 * 读最近的 `Stepper`。不在 `Stepper` 里（包括被浮层边界截断的情况）就报错，
 * 报错方式和上游 `useStepperContext` 一致。
 */
export function useStepperContext(): StepperContextValue {
  const context = readLayerScoped(stepperContextKey)
  if (context == null)
    throw new Error('useStepperContext must be used within Stepper. Wrap your Step in <Stepper>.')
  return context
}

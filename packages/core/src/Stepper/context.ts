import type { ComputedRef, InjectionKey } from 'vue'
import type { StepIndicator, StepperDensity, StepperIndicatorPosition, StepperOrientation, StepStatus } from './types.js'
import { inject } from 'vue'

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

export const stepperContextKey: InjectionKey<StepperContextValue | null> = Symbol('stepper')

/**
 * 读最近的 `Stepper`。不在 `Stepper` 里（包括被浮层边界截断的情况）就报错，
 * 报错方式和上游 `useStepperContext` 一致。
 */
export function useStepperContext(): StepperContextValue {
  const context = inject(stepperContextKey, null)
  if (context == null)
    throw new Error('useStepperContext must be used within Stepper. Wrap your Step in <Stepper>.')
  return context
}

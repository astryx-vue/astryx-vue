import type { ComputedRef, InjectionKey } from 'vue'
import type { StepIndicator, StepperDensity, StepperIndicatorPosition, StepperOrientation, StepStatus } from './types.js'

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

export const stepperContextKey: InjectionKey<StepperContextValue> = Symbol('stepper')

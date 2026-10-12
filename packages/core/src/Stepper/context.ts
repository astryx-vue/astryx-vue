import type { ComputedRef, InjectionKey } from 'vue'
import type { StepperDensity, StepperIndicatorPosition, StepperOrientation } from './types.js'

export interface StepperContextValue {
  activeStep: ComputedRef<number>
  orientation: ComputedRef<StepperOrientation>
  density: ComputedRef<StepperDensity>
  indicatorPosition: ComputedRef<StepperIndicatorPosition>
  isNonLinear: ComputedRef<boolean>
  hasCollapsibleLabels: ComputedRef<boolean>
  select: ComputedRef<((index: number) => void) | null>
}

export const stepperContextKey: InjectionKey<StepperContextValue> = Symbol('stepper')

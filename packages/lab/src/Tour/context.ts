import type { ComputedRef, InjectionKey } from 'vue'

export type TourDismissSource = 'backdrop' | 'escape' | 'close' | 'skip' | 'complete'

export interface TourContextValue {
  registerStep: (id: string) => () => void
  activeStepId: ComputedRef<string | null>
  activeStepIndex: ComputedRef<number>
  stepCount: ComputedRef<number>
  isStepCountShown: ComputedRef<boolean>
  hasBackdrop: ComputedRef<boolean>
  onNext: () => void
  onPrevious: () => void
  onDismiss: (source: TourDismissSource) => void
}

export const TOUR_CONTEXT_KEY: InjectionKey<TourContextValue> = Symbol('AstryxTour')

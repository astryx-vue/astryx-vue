import type { TourDismissSource } from './context.js'
import { inject } from 'vue'
import { TOUR_CONTEXT_KEY } from './context.js'

export interface UseTourReturn {
  readonly activeStepIndex: number
  readonly stepCount: number
  readonly isFirstStep: boolean
  readonly isLastStep: boolean
  next: () => void
  previous: () => void
  dismiss: (source: TourDismissSource) => void
}

/** 读取最近的 Tour。没有控制器时返回 null，由调用方决定是否跳过自定义 UI。 */
export function useTour(): UseTourReturn | null {
  const tour = inject(TOUR_CONTEXT_KEY, null)
  if (tour == null)
    return null
  return {
    get activeStepIndex() { return tour.activeStepIndex.value },
    get stepCount() { return tour.stepCount.value },
    get isFirstStep() { return tour.activeStepIndex.value <= 0 },
    get isLastStep() { return tour.stepCount.value > 0 && tour.activeStepIndex.value === tour.stepCount.value - 1 },
    next: tour.onNext,
    previous: tour.onPrevious,
    dismiss: tour.onDismiss,
  }
}

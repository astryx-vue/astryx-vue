import type { StepIndicator, StepProgress, StepStatus } from './types.js'

export type StepGlyph = 'check' | 'ring' | 'number' | 'warning' | 'error' | 'none'

/** Live docs default: a horizontal stepper collapses below this width per step. */
export const DEFAULT_MINIMUM_STEP_WIDTH = 112

export function shouldCollapseStepper(
  width: number,
  count: number,
  minimumStepWidth: number | undefined,
  orientation: 'horizontal' | 'vertical',
): boolean {
  if (orientation !== 'horizontal' || count < 1)
    return false
  return width < count * (minimumStepWidth ?? DEFAULT_MINIMUM_STEP_WIDTH)
}

export function resolveStepGlyph(options: {
  progress: StepProgress
  indicator: StepIndicator
  status?: StepStatus
}): StepGlyph {
  if (options.status === 'warning')
    return 'warning'
  if (options.status === 'error')
    return 'error'
  if (options.status === 'success' || (options.status == null && options.progress === 'completed' && options.indicator === 'auto'))
    return 'check'
  if (options.indicator === 'none')
    return 'none'
  if (options.indicator === 'number' || (options.indicator === 'auto' && options.progress === 'not-started'))
    return 'number'
  if (options.indicator === 'auto' && options.progress === 'in-progress')
    return 'ring'
  return 'none'
}

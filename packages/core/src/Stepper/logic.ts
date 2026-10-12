import type { StepIndicator, StepProgress, StepStatus } from './types.js'

export type StepGlyph = 'check' | 'ring' | 'number' | 'warning' | 'error' | 'none'

export function shouldCollapseStepper(
  width: number,
  count: number,
  minimumStepWidth: number | undefined,
  orientation: 'horizontal' | 'vertical',
): boolean {
  if (orientation !== 'horizontal' || minimumStepWidth == null || count < 1)
    return false
  return width < count * minimumStepWidth
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

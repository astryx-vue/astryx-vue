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

/**
 * One node-to-node span. Matches upstream `FILL_SPAN_TIME`: a fill that
 * crosses a whole segment is a spatial change, so it uses the medium band.
 */
export const STEP_FILL_SPAN_TIME = 'var(--astryx-duration-medium, 300ms)'

/**
 * Share of one on-track span owned by the segment arriving at the far node.
 * Horizontal halves are equal. Vertical uses 0.3 because upstream's lead cap
 * is one density space and the trail takes the rest.
 */
export const STEP_FILL_ARRIVAL_SHARE_H = 0.5
export const STEP_FILL_ARRIVAL_SHARE_V = 0.3

export interface ConnectorFillTiming {
  duration: string
  delay: string
}

/** Scale a CSS time by a unitless factor. Trivial factors stay readable. */
export function fillTimeSlice(time: string, factor: number): string {
  if (factor <= 0)
    return '0s'
  if (factor === 1)
    return time
  return `calc(${time} * ${Number(factor.toFixed(4))})`
}

/**
 * Timing for the segment covering `[offset, offset + share)` of span
 * `spanIndex`. Only a single step forward animates, and the span it crosses
 * is the one leaving the step the flow came from. Retreats, jumps, and the
 * first paint are instant.
 */
export function connectorFillTiming(
  activeStep: number,
  previousActiveStep: number,
  spanIndex: number,
  offset: number,
  share: number,
): ConnectorFillTiming {
  const isSingleAdvance = activeStep === previousActiveStep + 1
  if (!isSingleAdvance || spanIndex !== previousActiveStep)
    return { duration: '0s', delay: '0s' }
  return {
    duration: fillTimeSlice(STEP_FILL_SPAN_TIME, share),
    delay: fillTimeSlice(STEP_FILL_SPAN_TIME, offset),
  }
}

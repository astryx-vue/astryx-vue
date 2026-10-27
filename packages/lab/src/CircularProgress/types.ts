/** Variants a theme can extend through declaration merging in TypeScript. */
export interface CircularProgressVariantMap {
  accent: true
  success: true
  warning: true
  error: true
  neutral: true
}

export type CircularProgressVariant = keyof CircularProgressVariantMap

export type CircularProgressSize = 'sm' | 'md' | 'lg'

export interface CircularProgressProps {
  /** Current value of the circular progress. Ignored when `isIndeterminate` is true. */
  value?: number
  /**
   * Maximum value.
   * @default 100
   */
  max?: number
  /** Accessible label for the progress indicator. Required for a11y. */
  label: string
  /**
   * When true, the label is visually hidden but stays accessible to screen readers.
   * @default true
   */
  isLabelHidden?: boolean
  /**
   * When true, shows the formatted value (e.g. "75%") in the center of the ring.
   * Ignored when `isIndeterminate` is true, or when the default slot provides
   * custom center content.
   * @default false
   */
  hasValueLabel?: boolean
  /**
   * Custom formatter for the value label.
   * @default (value, max) => `${Math.round((value / max) * 100)}%`
   */
  formatValueLabel?: (value: number, max: number) => string
  /**
   * Diameter of the ring.
   * @default 'md'
   */
  size?: CircularProgressSize
  /**
   * Visual style variant mapped to semantic color tokens.
   * @default 'accent'
   */
  variant?: CircularProgressVariant
  /**
   * Animated indeterminate indicator for unknown progress. `value` and
   * `hasValueLabel` are ignored in this mode; reduced motion slows the animation.
   * @default false
   */
  isIndeterminate?: boolean
  /**
   * Disabled colors for canceled or inactive operations.
   * @default false
   */
  isDisabled?: boolean
}

/** Ring geometry per size: outer diameter and stroke width in px. */
export const SIZE_CONFIG = {
  sm: { diameter: 32, strokeWidth: 3 },
  md: { diameter: 48, strokeWidth: 4 },
  lg: { diameter: 64, strokeWidth: 5 },
} as const

/** Default center label: the rounded percentage of the filled range. */
export function defaultFormatValueLabel(value: number, max: number): string {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return `${pct}%`
}

export type StatusDotVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export interface StatusDotProps {
  /**
   * The semantic color variant.
   * @default 'neutral'
   */
  variant?: StatusDotVariant
  /**
   * Accessible label describing the status.
   */
  label: string
  /**
   * Whether the dot should pulse to indicate activity.
   * @default false
   */
  isPulsing?: boolean
  /**
   * Tooltip text shown on hover and on keyboard focus to explain the status.
   */
  tooltip?: string
}

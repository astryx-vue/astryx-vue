export type ProgressBarSize = 'sm' | 'md' | 'lg'
export type ProgressBarVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info'

export interface ProgressBarProps {
  value: number
  min?: number
  max?: number
  size?: ProgressBarSize
  variant?: ProgressBarVariant
  label?: string
  description?: string
  isIndeterminate?: boolean
  showValue?: boolean
  valueText?: string
  width?: number | string
}

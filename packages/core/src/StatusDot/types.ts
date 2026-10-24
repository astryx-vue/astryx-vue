import type { Component } from 'vue'

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
  /**
   * 画在圆点里的图标。不传时圆点只靠颜色表达状态。
   * 插槽 `icon` 优先于这个属性。
   */
  icon?: Component
}

export type ProgressBarSize = 'sm' | 'md' | 'lg'
export type ProgressBarVariant = 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info'

/** 轨道上的目标刻度。`value` 和进度条用同一把尺子，`label` 是无障碍名，也是悬停和聚焦时的提示。 */
export interface ProgressBarMark {
  value: number
  label: string
}

export interface ProgressBarProps {
  value?: number
  min?: number
  max?: number
  size?: ProgressBarSize
  variant?: ProgressBarVariant
  label?: string
  /**
   * Keep `label` available to assistive technology without painting it.
   * @default false
   */
  isLabelHidden?: boolean
  description?: string
  isIndeterminate?: boolean
  /** 在标签旁显示当前进度。`hasValueLabel` 是同一开关。 */
  showValue?: boolean
  /** 与 `showValue` 相同，对齐原版属性名。 */
  hasValueLabel?: boolean
  /** 自定义数值文案。优先于百分比和 `formatValueLabel`。 */
  valueText?: string
  /** 用当前值和最大值生成数值文案，例如 `3.2 GB / 5 GB`。 */
  formatValueLabel?: (value: number, max: number) => string
  /**
   * 轨道上的目标刻度。不确定进度时不画。
   * 落在填充色里的刻度用填充色上的前景色，还在轨道上的用主要文字色。
   */
  marks?: readonly ProgressBarMark[]
  width?: number | string
}

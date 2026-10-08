export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerShade = 'default' | 'onMedia' | 'subtle' | 'inherit'

export interface SpinnerProps {
  /** 圆环直径：sm 10px、md 14px、lg 18px、xl 28px。 */
  size?: SpinnerSize
  /** 配色层级，用于浅色背景、深色背景或继承文字颜色的场景。 */
  shade?: SpinnerShade
  /** 显示在加载态下方的文字。字符串会同时作为无障碍名称。 */
  label?: string
}

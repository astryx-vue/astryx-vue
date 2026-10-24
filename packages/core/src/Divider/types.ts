export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'subtle' | 'strong'

export interface DividerProps {
  /** 分隔线方向。 */
  orientation?: DividerOrientation
  /**
   * 显示在分隔线中间的文字，同时作为无障碍名称。
   * 数字 `0` 会显示出来。空字符串不显示。
   */
  label?: string | number
  /** 线条强弱。subtle 使用弱边框色，strong 使用强调边框色。 */
  variant?: DividerVariant
  /** 为 true 时，分隔线向外延伸到容器内边距之外。 */
  isFullBleed?: boolean
}

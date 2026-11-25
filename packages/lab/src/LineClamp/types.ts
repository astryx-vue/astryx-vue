export type LineClampAs = 'div' | 'span' | 'p'
export type LineClampTooltipPlacement = 'above' | 'below' | 'start' | 'end'

export interface LineClampProps {
  /** 截断前最多显示几行，超出部分以省略号结尾。0 表示不截断。 */
  maxLines: number
  /**
   * 截断时在悬停、轻点或键盘聚焦时用提示显示完整文字。截断的根元素会成为 Tab 停靠点
   * （`tabindex="0"`），键盘也能看到全文；你自己写的 `tabindex` 优先。
   * @default true
   */
  hasTruncateTooltip?: boolean
  /**
   * 截断提示的位置。
   * @default 'above'
   */
  truncateTooltipPlacement?: LineClampTooltipPlacement
  /**
   * 渲染的元素。
   * @default 'div'
   */
  as?: LineClampAs
}

export interface LineClampSlots {
  /** 要截断的内容：混合的行内内容、嵌套元素都可以。 */
  default?: () => unknown
}

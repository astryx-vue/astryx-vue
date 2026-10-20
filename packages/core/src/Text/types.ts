export type TextType = 'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3'
export type TextSize = 'sm' | 'md' | 'lg' | 'xl'
export type TextColor = 'primary' | 'secondary' | 'accent' | 'disabled' | 'placeholder' | 'inherit'
export type TextWeight = 'regular' | 'normal' | 'medium' | 'semibold' | 'bold'
export type TextWrap = 'wrap' | 'nowrap' | 'balance' | 'pretty'
export type TextWordBreak = 'normal' | 'break-word' | 'break-all'
export type TextDisplay = 'block' | 'inline'
export type TextAs = 'span' | 'p' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TextJustify = 'start' | 'center' | 'end'
export type TextTruncateTooltip = boolean | 'above' | 'below' | 'start' | 'end'

export interface TextProps {
  /**
   * Semantic text type. Determines size, weight, and line-height.
   * @default 'body'
   */
  type?: TextType
  /**
   * Explicit font size override.
   */
  size?: TextSize
  /**
   * Text color.
   * @default 'primary'
   */
  color?: TextColor
  /**
   * Font weight override. `normal` is the same weight as `regular`.
   */
  weight?: TextWeight
  /**
   * CSS `text-wrap` behavior.
   */
  textWrap?: TextWrap
  /**
   * How long unbroken strings break inside a constrained width.
   */
  wordBreak?: TextWordBreak
  /**
   * 用 `text-box-trim` 裁掉文字上下多余的留白，让首行字形贴住盒子边缘。
   * 打开后强制块级布局。
   * @default false
   */
  hasCapsize?: boolean
  /**
   * Draws a line through the text.
   * @default false
   */
  hasStrikethrough?: boolean
  /**
   * Uses tabular figures so digits line up across rows.
   * @default false
   */
  hasTabularNumbers?: boolean
  /**
   * Display type.
   * @default 'inline'
   */
  display?: TextDisplay
  /**
   * HTML element to render. Heading tags render a real `h1`–`h6`, but keep
   * `Text` typography; use `Heading` when you also want heading sizing.
   * @default 'span'
   */
  as?: TextAs
  /**
   * Text alignment. `start` and `end` follow the writing direction.
   * @default 'start'
   */
  justify?: TextJustify
  /**
   * Maximum lines before truncation. 0 means no truncation.
   * A positive value forces block layout so the ellipsis has a width.
   * @default 0
   */
  maxLines?: number
  /**
   * 截断之后要不要把全文放进提示。`true` 出现在上方，方位字符串指定位置，`false` 关掉。
   * 没被截断时不会弹出。
   * @default true
   */
  hasTruncateTooltip?: TextTruncateTooltip
}

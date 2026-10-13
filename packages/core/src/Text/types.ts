export type TextType = 'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3'
export type TextSize = 'sm' | 'md' | 'lg' | 'xl'
export type TextColor = 'primary' | 'secondary' | 'accent' | 'disabled' | 'placeholder' | 'inherit'
export type TextWeight = 'regular' | 'normal' | 'medium' | 'semibold' | 'bold'
export type TextWrap = 'wrap' | 'nowrap' | 'balance' | 'pretty'
export type TextWordBreak = 'normal' | 'break-word' | 'break-all'
export type TextDisplay = 'block' | 'inline'
export type TextAs = 'span' | 'p' | 'div' | 'label'

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
   * HTML element to render.
   * @default 'span'
   */
  as?: TextAs
  /**
   * Maximum lines before truncation. 0 means no truncation.
   * A positive value forces block layout so the ellipsis has a width.
   * @default 0
   */
  maxLines?: number
}

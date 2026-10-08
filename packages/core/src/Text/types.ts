export type TextType = 'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3'
export type TextSize = 'sm' | 'md' | 'lg' | 'xl'
export type TextColor = 'primary' | 'secondary' | 'accent' | 'inherit'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
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
   * Font weight override.
   */
  weight?: TextWeight
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
   * @default 0
   */
  maxLines?: number
}

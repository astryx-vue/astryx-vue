export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingType = 'display-1' | 'display-2' | 'display-3' | 'body' | 'large' | 'label' | 'supporting'
export type HeadingColor = 'primary' | 'secondary' | 'accent' | 'inherit'
export type HeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type HeadingDisplay = 'block' | 'inline'

export interface HeadingProps {
  /**
   * Heading level (1-6). Determines the semantic HTML element (h1–h6).
   */
  level: HeadingLevel
  /**
   * Visual type variant. When set, overrides the default sizing from `level`.
   */
  type?: HeadingType
  /**
   * Text color.
   * @default 'primary'
   */
  color?: HeadingColor
  /**
   * Font weight override.
   */
  weight?: HeadingWeight
  /**
   * Display type.
   * @default 'block'
   */
  display?: HeadingDisplay
  /**
   * Maximum lines before truncation. 0 means no truncation.
   * @default 0
   */
  maxLines?: number
}

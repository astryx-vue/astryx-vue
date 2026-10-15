export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingType = 'display-1' | 'display-2' | 'display-3' | 'body' | 'large' | 'label' | 'supporting'
export type HeadingColor = 'primary' | 'secondary' | 'accent' | 'inherit'
export type HeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type HeadingDisplay = 'block' | 'inline'
export type HeadingWrap = 'wrap' | 'nowrap' | 'balance' | 'pretty'
export type HeadingWordBreak = 'break-word' | 'break-all'
export type HeadingJustify = 'start' | 'center' | 'end'
export type HeadingTruncateTooltip = boolean | 'above' | 'below' | 'start' | 'end'

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
   * Document outline level when it should differ from the visual `level`.
   * The element stays `h{level}`; assistive technology reads this instead.
   */
  accessibilityLevel?: HeadingLevel
  /**
   * CSS `text-wrap` behavior.
   */
  textWrap?: HeadingWrap
  /**
   * How long unbroken strings break. Single-line truncation defaults to
   * `break-all`; more than one line defaults to `break-word`.
   */
  wordBreak?: HeadingWordBreak
  /**
   * Text alignment. `start` and `end` follow the writing direction.
   * @default 'start'
   */
  justify?: HeadingJustify
  /**
   * Draws a line through the text.
   * @default false
   */
  hasStrikethrough?: boolean
  /**
   * Maximum lines before truncation. 0 means no truncation.
   * @default 0
   */
  maxLines?: number
  /**
   * 截断之后要不要把全文放进提示。`true` 出现在上方，方位字符串指定位置，`false` 关掉。
   * @default true
   */
  hasTruncateTooltip?: HeadingTruncateTooltip
}

import type { SpacingStep } from '../Stack/types.js'

export type CardSizeValue = number | string

/**
 * Background colour variant.
 *
 * `default` uses the card surface and draws the visible border, `transparent`
 * drops both the background and the border so the card only groups content,
 * and `muted` uses the muted surface for a de-emphasised card. The remaining
 * names are the non-semantic hues and use the tint for that hue.
 */
/**
 * 卡片背景变体。主题可以扩充这张表，从而给 `variant` 增加自己的名字：
 *
 * ```ts
 * declare module '@astryx-vue/core' {
 *   interface CardVariantMap {
 *     brand: true
 *   }
 * }
 * ```
 *
 * 新增的变体要在主题里自己写背景。可选卡片的描边读 `--astryx-selectable-card-accent`，
 * 主题在同一条规则里指定它，避免组件去猜一种和填充色对比得过来的颜色。
 */
export interface CardVariantMap {
  default: true
  transparent: true
  muted: true
  blue: true
  cyan: true
  gray: true
  green: true
  orange: true
  pink: true
  purple: true
  red: true
  teal: true
  yellow: true
}

export type CardVariant = keyof CardVariantMap

/**
 * Resting shadow depth. `none` is flat; `low`, `med`, and `high` follow the
 * shadow scale, ascending in intensity.
 */
export type CardElevation = 'none' | 'low' | 'med' | 'high'

export interface CardProps {
  /**
   * Height of the card. Numbers are interpreted as pixels.
   *
   * A fixed height turns the card into a viewport for its own content: the
   * content scrolls instead of stretching the card. `auto` and an omitted
   * height leave the height to the content.
   *
   * @default undefined
   */
  height?: CardSizeValue
  /**
   * Maximum width of the card. Numbers are interpreted as pixels.
   *
   * @default undefined
   */
  maxWidth?: CardSizeValue
  /**
   * Minimum height of the card. Numbers are interpreted as pixels.
   *
   * @default undefined
   */
  minHeight?: CardSizeValue
  /**
   * Internal padding on every side, using the spacing scale.
   *
   * Omit it and the card uses the theme's card padding rather than a step, so
   * passing a step is a decision to override the theme instead of a way to
   * restate the default.
   *
   * @default undefined (the theme's card padding; neutral uses step 3, otherwise step 4)
   */
  padding?: SpacingStep
  /**
   * Background colour variant.
   *
   * @default 'default'
   */
  variant?: CardVariant
  /**
   * Resting shadow depth.
   *
   * @default 'none'
   */
  elevation?: CardElevation
  /**
   * Width of the card. Numbers are interpreted as pixels.
   *
   * In a flex row or a grid track this is a preferred width: the card still
   * shrinks below it when the row is narrower.
   *
   * @default undefined
   */
  width?: CardSizeValue
}

export interface CardSlots {
  /**
   * The card's content. Often a Stack holding a heading, text, and actions.
   */
  default?: () => unknown
}

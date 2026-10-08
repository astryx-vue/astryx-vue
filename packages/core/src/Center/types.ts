import type { VNodeChild } from 'vue'
import type { SpacingStep } from '../Stack/types.js'

/**
 * Which axis or axes Center aligns its content on.
 *
 * `horizontal` and `vertical` are named after the physical axes in horizontal
 * writing. They are implemented as flex alignment, so in vertical writing they
 * follow the flex main and cross axes instead.
 */
export type CenterAxis = 'both' | 'horizontal' | 'vertical'

/**
 * A size for Center's own box. Numbers are interpreted as pixels, strings are
 * used as-is, so `100` becomes `100px` and `'100%'` stays `'100%'`.
 */
export type CenterSizeValue = number | string

export interface CenterProps {
  /**
   * Which axis or axes to center the content on.
   *
   * - `both` centers on the flex main and cross axes.
   * - `horizontal` centers on the flex main/inline axis.
   * - `vertical` centers on the flex cross/block axis.
   *
   * Centering an axis only has an effect when the box has space to distribute
   * along it, so give Center a `height` when using `vertical` or `both` inside
   * content that is otherwise only as tall as the children.
   *
   * @default 'both'
   */
  axis?: CenterAxis
  /**
   * Width of the container. Numbers are interpreted as pixels.
   */
  width?: CenterSizeValue
  /**
   * Height of the container. Numbers are interpreted as pixels.
   */
  height?: CenterSizeValue
  /**
   * Maximum width of the container. Numbers are interpreted as pixels.
   */
  maxWidth?: CenterSizeValue
  /**
   * Minimum height of the container. Numbers are interpreted as pixels.
   */
  minHeight?: CenterSizeValue
  /**
   * Inner padding on all sides, using the Astryx spacing scale.
   */
  padding?: SpacingStep
  /**
   * Inline-axis padding; overrides `padding` on that axis.
   */
  paddingInline?: SpacingStep
  /**
   * Inline-start padding; overrides `paddingInline` and `padding` on that edge
   * only. The physical edge follows writing mode and direction.
   */
  paddingInlineStart?: SpacingStep
  /**
   * Inline-end padding; overrides `paddingInline` and `padding` on that edge
   * only. The physical edge follows writing mode and direction.
   */
  paddingInlineEnd?: SpacingStep
  /**
   * Block-axis padding; overrides `padding` on that axis.
   */
  paddingBlock?: SpacingStep
  /**
   * Block-start padding; overrides `paddingBlock` and `padding` on that edge
   * only. The physical edge follows writing mode.
   */
  paddingBlockStart?: SpacingStep
  /**
   * Block-end padding; overrides `paddingBlock` and `padding` on that edge
   * only. The physical edge follows writing mode.
   */
  paddingBlockEnd?: SpacingStep
  /**
   * Renders the container as `inline-flex`, so it can sit inside a line of text
   * without breaking the text flow. Useful for centering an icon or a small
   * glyph in a fixed-size box.
   *
   * @default false
   */
  isInline?: boolean
}

export interface CenterSlots {
  /**
   * The content to center. Center adds no semantics of its own, so the content
   * keeps its own roles, accessible names, and reading order.
   */
  default?: () => VNodeChild
}

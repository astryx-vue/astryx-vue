import type { Component } from 'vue'

export type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
export type StackCrossAlignment = 'center' | 'end' | 'start' | 'stretch'
export type StackDirection = 'horizontal' | 'vertical'
export type StackMainAlignment = 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start'
export type StackAlignment = StackCrossAlignment | StackMainAlignment
export type StackWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
export type StackItemCrossAlignSelf = StackCrossAlignment
export type StackItemSize = 'fill' | 'static'
export type StackSizeValue = number | string
export type StackElement = Component | string

export interface StackProps {
  /** Cross-axis alignment alias. */
  align?: StackCrossAlignment
  /** The element or component rendered at the root. @default 'div' */
  as?: StackElement
  /** Direction of the stack layout. @default 'vertical' */
  direction?: StackDirection
  /** Spacing between children using the Astryx spacing scale. */
  gap?: SpacingStep
  /** Height of the stack. Numbers are interpreted as pixels. */
  height?: StackSizeValue
  /** Horizontal alignment, resolved according to direction. */
  hAlign?: StackAlignment
  /** Enables scrollable overflow. @default false */
  isScrollable?: boolean
  /** Main-axis alignment alias. */
  justify?: StackMainAlignment
  /** Maximum width of the stack. Numbers are interpreted as pixels. */
  maxWidth?: StackSizeValue
  /** Minimum height of the stack. Numbers are interpreted as pixels. */
  minHeight?: StackSizeValue
  /** Padding on both axes using the Astryx spacing scale. */
  padding?: SpacingStep
  /** Block-axis padding; overrides padding on this axis. */
  paddingBlock?: SpacingStep
  /** Inline-axis padding; overrides padding on this axis. */
  paddingInline?: SpacingStep
  /** Vertical alignment, resolved according to direction. */
  vAlign?: StackAlignment
  /** Width of the stack. Numbers are interpreted as pixels. */
  width?: StackSizeValue
  /** Flex wrapping behavior. @default 'nowrap' */
  wrap?: StackWrap
}

export interface HStackProps extends Omit<StackProps, 'direction' | 'hAlign' | 'vAlign'> {
  /** Horizontal main-axis alignment. */
  hAlign?: StackMainAlignment
  /** Vertical cross-axis alignment. */
  vAlign?: StackCrossAlignment
}

export interface VStackProps extends Omit<StackProps, 'direction' | 'hAlign' | 'vAlign'> {
  /** Horizontal cross-axis alignment. */
  hAlign?: StackCrossAlignment
  /** Vertical main-axis alignment. */
  vAlign?: StackMainAlignment
}

export interface StackItemProps {
  /** The element or component rendered at the root. @default 'div' */
  as?: StackElement
  /** Overrides the parent stack's cross-axis alignment. */
  crossAlignSelf?: StackItemCrossAlignSelf
  /** Enables scrollable overflow. @default false */
  isScrollable?: boolean
  /** Flex sizing behavior. @default 'static' */
  size?: StackItemSize
}

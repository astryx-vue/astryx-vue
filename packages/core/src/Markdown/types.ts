import type { Component, VNodeChild } from 'vue'

export type MarkdownDisplay = 'block' | 'inline'
export type MarkdownDensity = 'default' | 'compact'
export type MarkdownAlign = 'start' | 'center'
export type MarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface MarkdownHeadingProps {
  level: MarkdownHeadingLevel
  id: string
}

export interface MarkdownLinkProps {
  href: string
}

export interface MarkdownImageProps {
  alt: string
  src: string
}

export interface MarkdownCodeProps {
  code: string
  language?: string
}

export interface MarkdownInlineCodeProps {
  value: string
}

export interface MarkdownListProps {
  ordered: boolean
  start?: number
}

/**
 * Replacement renderers for a node kind. Each component receives the node's
 * data as props and, where the node has content, that content as the default
 * slot. A string tag such as `'p'` is also a valid component.
 */
export interface MarkdownComponents {
  blockquote?: Component
  code?: Component
  heading?: Component
  hr?: Component
  image?: Component
  inlineCode?: Component
  link?: Component
  list?: Component
  paragraph?: Component
  table?: Component
}

export interface MarkdownProps {
  /**
   * Horizontal alignment of the prose measure when `contentWidth` is set.
   * @default 'start'
   */
  contentAlign?: MarkdownAlign
  /**
   * Markdown source. A default slot string is used when this is omitted.
   */
  content?: string
  /**
   * Maximum width of prose blocks. Tables and code blocks keep the container
   * width. Numbers are pixels.
   */
  contentWidth?: number | string
  /**
   * Renderers that replace the built-in node views.
   */
  components?: MarkdownComponents
  /**
   * Vertical rhythm. `compact` tightens the space between blocks.
   * @default 'default'
   */
  density?: MarkdownDensity
  /**
   * `inline` renders the source as phrasing content inside a span.
   * @default 'block'
   */
  display?: MarkdownDisplay
  /**
   * The heading level that a markdown `#` maps to. Deeper headings shift with
   * it and stop at `h6`.
   * @default 1
   */
  headingLevelStart?: MarkdownHeadingLevel
  /**
   * Reveals appended source smoothly and re-parses only the open trailing
   * block. Settled blocks keep their rendered nodes.
   * @default false
   */
  isStreaming?: boolean
  /**
   * Called when a link is activated. Return `false` to cancel navigation.
   */
  onLinkClick?: (href: string, event: MouseEvent) => void | false
}

export interface MarkdownSlots {
  default?: () => VNodeChild
}

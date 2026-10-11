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

export interface MarkdownSource {
  title?: string
  url?: string
  /**
   * Favicon or logo URL, drawn in a round slot before the label.
   */
  icon?: string
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
   * Re-parses only the open trailing block and fades in appended text.
   * Settled blocks keep their rendered nodes. This prop does not reveal
   * characters on its own. Run `useStreamingText` first and pass that string
   * as `content`; `Markdown` will not smooth the string a second time.
   * @default false
   */
  isStreaming?: boolean
  /**
   * Called when a link is activated. Return `false` to cancel navigation.
   */
  onLinkClick?: (href: string, event: MouseEvent) => void | false
  /**
   * Citation sources keyed by id. `[id]` and `【id】` that match a key render
   * as a label chip instead of literal text.
   */
  sources?: Record<string, MarkdownSource>
}

export interface MarkdownSlots {
  default?: () => VNodeChild
}

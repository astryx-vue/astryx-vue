import type { Component, VNodeChild } from 'vue'
import type { MarkdownPluginEntry } from './plugin-protocol/protocol.js'
import type { MarkdownInlinePlugin, MarkdownPlugin } from './plugins.js'

export type MarkdownDisplay = 'block' | 'inline'
export type MarkdownDensity = 'default' | 'compact'
export type MarkdownAlign = 'start' | 'center'
export type MarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type MarkdownAutolink = 'gfm'
export type MarkdownCitationStyle = 'label' | 'number'

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
   * Document plugins. A `MarkdownPlugin` may replace the parsed tree and draw
   * the extension nodes it owns. A `MarkdownPluginEntry` from
   * `createMarkdownPlugin` runs syntax and transforms, including
   * `markdownSourceLinesPlugin`. An empty list leaves the document unchanged.
   */
  plugins?: readonly (MarkdownPlugin | MarkdownPluginEntry)[]
  /**
   * Patterns matched against text nodes, in order. The first match at a
   * position wins. Inline code and fenced code are left alone.
   */
  inlinePlugins?: readonly MarkdownInlinePlugin[]
  /**
   * `'gfm'` links bare `https://` URLs, `www.` hosts, and emails.
   * Omit it and those stay text. `<https://…>` and `<email>` stay links.
   */
  autolink?: MarkdownAutolink
  /**
   * `label` is a chip with the source title. `number` is a compact badge.
   * @default 'label'
   */
  citationStyle?: MarkdownCitationStyle
  /**
   * Citation sources keyed by id. `[id]` and `【id】` that match a key render
   * as a citation chip instead of literal text.
   */
  sources?: Record<string, MarkdownSource>
}

export interface MarkdownSlots {
  default?: () => VNodeChild
}

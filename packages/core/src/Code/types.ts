import type { VNodeChild } from 'vue'
import type { SyntaxThemeDefinition } from './syntaxTheme.js'

/**
 * The text color of inline code.
 *
 * `primary` and `secondary` mirror the matching Text colors; `inherit` takes
 * the color of the surrounding prose.
 */
export type CodeColor = 'primary' | 'secondary' | 'inherit'

/**
 * The font size of inline code. `inherit` adopts the surrounding font size and
 * line height, which keeps inline code in step with differently sized text.
 */
export type CodeSize = 'inherit'

export interface CodeProps {
  /**
   * The text color of the code.
   * @default 'primary'
   */
  color?: CodeColor
  /**
   * The font size of the code.
   *
   * Omit it to use the code type scale, or set `inherit` to adopt the
   * surrounding font size and line height.
   */
  size?: CodeSize
}

export interface CodeSlots {
  /** The inline code content. */
  default?: () => VNodeChild
}

/** The text size of a CodeBlock, which also selects its line height. */
export type CodeBlockSize = 'sm' | 'md'

/**
 * How a CodeBlock presents its container.
 *
 * `card` is a standalone block with a border, radius, and its own background.
 * `section` drops the border and background so the block blends into the card
 * or panel it is embedded in.
 */
export type CodeBlockContainer = 'card' | 'section'

/**
 * How a CodeBlock paints syntax tokens.
 *
 * `ranges` uses the CSS Custom Highlight API, which keeps the code text free of
 * extra elements; `spans` wraps each token in an element. `auto` picks the
 * cheapest path the current browser supports well.
 */
export type CodeHighlightMode = 'auto' | 'ranges' | 'spans'

/** One syntax token: a token type and a half-open range in the line. */
export interface SyntaxToken {
  type: string
  end: number
  start: number
}

/** One line of syntax tokens, using offsets relative to the start of the line. */
export type TokenLine = SyntaxToken[]

/**
 * A custom tokenizer. It receives the whole code string and the language name,
 * and returns tokens whose offsets are absolute within that string.
 */
export type CodeBlockTokenizer = (code: string, language: string) => SyntaxToken[]

export interface CodeBlockProps {
  /** The read-only code to display. */
  code: string
  /**
   * The language used for syntax highlighting. An unknown language renders as
   * plaintext. `plaintext` also hides the language label in the header.
   * @default 'plaintext'
   */
  language?: string
  /**
   * Syntax colors for this block.
   *
   * Shorthand for wrapping the block in `SyntaxTheme`. A surrounding
   * `SyntaxTheme` still themes every code component in that region.
   */
  syntaxTheme?: SyntaxThemeDefinition
  /** A filename or label shown in the header bar next to the language. */
  title?: string
  /**
   * Whether the language name appears in the header bar.
   *
   * It is never shown for `plaintext`, because that label carries no
   * information.
   * @default true
   */
  hasLanguageLabel?: boolean
  /**
   * Whether to draw a line number gutter.
   * @default false
   */
  hasLineNumbers?: boolean
  /** One-indexed line numbers to emphasize with an accent background. */
  highlightLines?: number[]
  /**
   * Whether to show the copy button.
   * @default true
   */
  hasCopyButton?: boolean
  /**
   * Whether long lines wrap instead of scrolling horizontally.
   * @default false
   */
  isWrapped?: boolean
  /**
   * The maximum height before the code body scrolls vertically. Numbers are
   * interpreted as pixels; `0` is a valid zero-pixel bound.
   */
  maxHeight?: number | string
  /**
   * Whether the header collapses the code body.
   *
   * The block starts expanded. The header only becomes a disclosure control
   * when it is visible and the code reaches `collapsibleThreshold` lines.
   * @default false
   */
  isCollapsible?: boolean
  /**
   * The number of lines a block needs before the collapse control appears.
   * @default 10
   */
  collapsibleThreshold?: number
  /**
   * The text size variant.
   * @default 'md'
   */
  size?: CodeBlockSize
  /**
   * The width of the block. Accepts any CSS width value.
   *
   * `fit-content` shrinks the block to its longest line, with a floor so a
   * short snippet still reads as a block; `100%` fills the parent container.
   * @default 'fit-content'
   */
  width?: string
  /**
   * The container presentation, as a card or as a section.
   * @default 'card'
   */
  container?: CodeBlockContainer
  /**
   * A custom tokenizer, for a language the built-in tokenizer does not know.
   * Its return value paints tokens but never replaces the displayed or copied
   * code text.
   */
  tokenizer?: CodeBlockTokenizer
  /**
   * The syntax painting strategy.
   * @default 'auto'
   */
  highlightMode?: CodeHighlightMode
  /**
   * The accessible name of the copy control while the code is not copied.
   * @default 'Copy code'
   */
  copyLabel?: string
  /**
   * The copy control name and announcement after a successful copy.
   * @default 'Copied'
   */
  copiedLabel?: string
  /**
   * The accessible name of the code viewport, and of a collapsible header that
   * has no visible title or language label.
   * @default 'Code'
   */
  codeLabel?: string
}

export interface CodeBlockEmits {
  /** Emitted after the code string was written to the clipboard. */
  copy: []
}

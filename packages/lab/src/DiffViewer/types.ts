/**
 * @file types.ts
 * @input diffTypes.ts and the shared syntax-theme type
 * @output DiffViewerProps, DiffViewerEmits, DiffViewerSlots, DiffViewerViewMode,
 *   DiffViewerInlineHighlight
 * @position Lab component contract; re-exported by index.ts and the lab root
 */

import type { SyntaxThemeDefinition } from '@astryx-vue/core'
import type { VNodeChild } from 'vue'
import type { DiffViewerFile, DiffViewerLineRef } from './diffTypes.js'

/** How hunks are laid out: one column, or old and new side by side. */
export type DiffViewerViewMode = 'unified' | 'split'

/**
 * How finely to highlight what changed inside a removed line and the added
 * line that replaced it: by `word`, by `char`acter, or `none`.
 */
export type DiffViewerInlineHighlight = 'word' | 'char' | 'none'

export interface DiffViewerProps {
  /**
   * The file to render. Build one with `parseUnifiedDiff(patch)` (one per file
   * in the patch) or `createDiffFile({oldValue, newValue})`.
   */
  file: DiffViewerFile
  /**
   * `unified` shows one column with removed lines above their replacements;
   * `split` shows the old file on the left and the new file on the right,
   * pairing each removed line with the added line that replaced it.
   * @default 'unified'
   */
  viewMode?: DiffViewerViewMode
  /**
   * Syntax-highlighting language. Defaults to one inferred from the file's
   * extension; unknown extensions render as plain text.
   */
  language?: string
  /**
   * Show the old and new line-number gutters.
   * @default true
   */
  hasLineNumbers?: boolean
  /**
   * Wrap long lines instead of scrolling them horizontally.
   * @default false
   */
  isWrapped?: boolean
  /**
   * Highlight the changed words (or characters) inside each removed line and
   * the added line that replaced it. Lines that share nothing but whitespace
   * get no inline highlight; the row tint already marks them.
   * @default 'word'
   */
  inlineHighlight?: DiffViewerInlineHighlight
  /**
   * Make the file header a disclosure that hides and shows the hunks. Needs a
   * file path to name the control.
   * @default true
   */
  isCollapsible?: boolean
  /** Controlled collapsed state. Pair with `collapsedChange`. */
  isCollapsed?: boolean
  /**
   * Initial collapsed state when uncontrolled.
   * @default false
   */
  defaultIsCollapsed?: boolean
  /** Maximum height of the hunk area before it scrolls. */
  maxHeight?: number | string
  /**
   * Per-instance syntax theme. Without it the nearest `SyntaxTheme` or the
   * theme's syntax colors apply.
   */
  syntaxTheme?: SyntaxThemeDefinition
  /** Accessible name for the scrollable hunk area. @default 'Diff' */
  label?: string
  /**
   * Render content in a full-width row under a line, e.g. review comments.
   * Return `null` for lines with nothing to show. In split view the row sits
   * under the line's own side.
   */
  renderLineAnnotation?: (ref: DiffViewerLineRef) => VNodeChild
}

export interface DiffViewerEmits {
  /** The header disclosure was toggled; carries the next collapsed state. */
  'collapsedChange': [isCollapsed: boolean]
  /** v-model:isCollapsed support. */
  'update:isCollapsed': [isCollapsed: boolean]
  /**
   * A line number was clicked. Only the number on the line's anchor side is a
   * button, so a context line reports its new side.
   */
  'lineNumberClick': [ref: DiffViewerLineRef, event: MouseEvent]
}

export interface DiffViewerSlots {
  /** Content at the end of the file header, e.g. a "Viewed" checkbox. */
  headerEnd?: () => VNodeChild
}

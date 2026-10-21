import { createMarkdownSourceLinesEntry } from './protocol.js'

/**
 * Records the 1-based source lines of every block the renderer stamps.
 * Built-in blocks get `data-source-line` and `data-source-line-end`.
 * `components` replacements get a `sourceLines` prop instead.
 * Without this plugin, no line attributes are written.
 */
export const markdownSourceLinesPlugin = createMarkdownSourceLinesEntry('source-lines')

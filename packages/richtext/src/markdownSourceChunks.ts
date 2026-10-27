// 把 Markdown 源码切成「块」：连续的非空行算一块，围栏代码块跨空行也算一块，
// 分割线永远单独一块，这样改动旁边的块不会重写分割线。每块的 leading/content/trailing
// 拼起来正好是原文。

/** The whitespace and content one chunk of Markdown source was split into. */
export interface MarkdownChunk {
  /** Blank lines before the chunk; only the first chunk has any. */
  readonly leading: string
  /** The chunk's lines, without the line ending that ends the last one. */
  readonly content: string
  /** Everything after the content up to the next chunk, or to the end. */
  readonly trailing: string
}

const BLANK_LINE = /^[ \t]*\r?$/
const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/
// A thematic break line (CommonMark 0.31), and the dash-only lines that
// underline a paragraph line above them as a heading instead.
export const THEMATIC_BREAK_LINE = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*\r?$/
export const SETEXT_DASHES = /^ {0,3}-+[ \t]*\r?$/
// Lines that start a block other than a paragraph.
const BLOCK_START
  = /^ {0,3}(?:[-*+][ \t]|\d{1,9}[.)][ \t]|>|#{1,6}(?:[ \t]|\r?$)|\|)/

/**
 * The chunks of `markdown` that cover the same lines as `like`, the chunks of
 * text with the same line count. Rewriting indentation can move a line across
 * a chunk boundary rule — a thematic break indented into a list item becomes
 * a break of its own — so the chunks follow the authored text, not the rule.
 */
export function sameLines(
  markdown: string,
  like: ReadonlyArray<MarkdownChunk>,
): Array<MarkdownChunk> {
  const lines = markdown.split('\n')
  const lineEndings = (text: string): number => text.split('\n').length - 1
  let line = 0
  return like.map((chunk) => {
    line += lineEndings(chunk.leading)
    const count = lineEndings(chunk.content) + 1
    const content = lines.slice(line, line + count).join('\n')
    line += count - 1 + lineEndings(chunk.trailing)
    return { ...chunk, content }
  })
}

/**
 * Splits Markdown into chunks: runs of non-blank lines, with a fenced code
 * block kept whole across blank lines, and a thematic break always a chunk of
 * its own, so editing the block beside a rule never rewrites the rule
 * (spec:AST-062 FR2). A dash-only line under paragraph lines underlines them
 * instead, and stays with them. Joining every chunk's leading, content, and
 * trailing text gives back the input exactly.
 */
export function splitMarkdownChunks(markdown: string): Array<MarkdownChunk> {
  const lines = markdown.split('\n')
  const chunks: Array<MarkdownChunk> = []
  let leading = ''
  let index = 0
  // Blank lines before the first chunk.
  while (index < lines.length && BLANK_LINE.test(lines[index])) {
    if (index === lines.length - 1) {
      // Whitespace with no content at all.
      return []
    }
    leading += `${lines[index]}\n`
    index++
  }
  while (index < lines.length) {
    const start = index
    let fence: string | null = null
    // Whether every line so far is paragraph text.
    let isParagraph = true
    while (index < lines.length) {
      const line = lines[index]
      if (fence != null) {
        index++
        const close = new RegExp(
          `^ {0,3}${fence[0]}{${fence.length},}[ \\t]*\\r?$`,
        )
        if (close.test(line)) {
          fence = null
        }
        continue
      }
      if (BLANK_LINE.test(line)) {
        break
      }
      const isRule
        = THEMATIC_BREAK_LINE.test(line)
          && !(isParagraph && index > start && SETEXT_DASHES.test(line))
      if (isRule && index > start) {
        // The rule starts a chunk of its own.
        break
      }
      const open = FENCE_OPEN.exec(line)
      if (open != null) {
        fence = open[1]
      }
      if (open != null || BLOCK_START.test(line)) {
        isParagraph = false
      }
      index++
      if (isRule) {
        // And ends it.
        break
      }
    }
    let content = lines.slice(start, index).join('\n')
    let trailing = ''
    // A CRLF line ending belongs to the trailing text, not the content.
    if (content.endsWith('\r')) {
      content = content.slice(0, -1)
      trailing = '\r'
    }
    while (index < lines.length && BLANK_LINE.test(lines[index])) {
      trailing += `\n${lines[index]}`
      index++
    }
    if (index < lines.length) {
      // The line ending before the next chunk's first line.
      trailing += '\n'
    }
    chunks.push({
      leading: chunks.length === 0 ? leading : '',
      content,
      trailing,
    })
  }
  return chunks
}

import type { MdNode } from './ast.js'

/**
 * Upstream reads a line whose block marker is indented four or more columns as
 * ordinary paragraph text, with the indentation kept and inline syntax read
 * inside it. This parser reads Markdown with micromark, which sees such a line
 * as an indented code block, so a heading, a block quote, or a fence marker
 * that sits that deep is swapped for a private-use placeholder first. The swap
 * keeps every offset and every length, and {@link IndentationMask.restore}
 * puts the original spaces and tabs back into the text it produced.
 */

/** Columns a tab counts for when deciding whether a line is indented too deep. */
const TAB_COLUMNS = 4

function columnWidth(whitespace: string): number {
  let columns = 0
  for (const character of whitespace)
    columns += character === '\t' ? TAB_COLUMNS : 1
  return columns
}

/** Leading spaces and tabs of the line `start` sits on. */
function lineIndent(text: string, start: number): string {
  let lineStart = text.lastIndexOf('\n', start - 1) + 1
  if (lineStart < 0)
    lineStart = 0
  let end = lineStart
  while (end < text.length && (text[end] === ' ' || text[end] === '\t'))
    end++
  return text.slice(lineStart, end)
}

/** Private-use characters the source does not use. */
export function freeCharacters(source: string, count: number): string[] {
  const used = new Set(source)
  const free: string[] = []
  for (let code = 0xE000; code <= 0xF8FF && free.length < count; code++) {
    const character = String.fromCharCode(code)
    if (!used.has(character))
      free.push(character)
  }
  return free.length === count ? free : []
}

export interface IndentationMask {
  /** The source with the indentation of the marked lines swapped out. */
  readonly text: string
  /**
   * Marks the block `node` (and the lines it spans) as paragraph text, and
   * returns true when anything changed.
   */
  mark: (node: MdNode) => boolean
  /** Puts the original spaces and tabs back into a text value. */
  restore: (value: string) => string
}

class Mask implements IndentationMask {
  private readonly chars: { space: string, tab: string }
  private current: string

  constructor(source: string, chars: { space: string, tab: string }) {
    this.chars = chars
    this.current = source
  }

  get text(): string {
    return this.current
  }

  restore(value: string): string {
    if (!value.includes(this.chars.space) && !value.includes(this.chars.tab))
      return value
    return value
      .split(this.chars.space)
      .join(' ')
      .split(this.chars.tab)
      .join('\t')
  }

  mark(node: MdNode): boolean {
    const start = node.position?.start?.offset
    const end = node.position?.end?.offset
    if (start == null || end == null)
      return false

    let changed = false
    let lineStart = Math.max(0, this.current.lastIndexOf('\n', start - 1) + 1)
    while (lineStart <= end) {
      const lineEnd = this.current.indexOf('\n', lineStart)
      const stop = lineEnd === -1 ? this.current.length : lineEnd
      if (this.indentLine(lineStart, stop))
        changed = true
      if (lineEnd === -1)
        break
      lineStart = lineEnd + 1
    }
    return changed
  }

  /** Swaps the leading whitespace of one line when it is deep enough. */
  private indentLine(lineStart: number, lineEnd: number): boolean {
    let indentEnd = lineStart
    while (indentEnd < lineEnd && (this.current[indentEnd] === ' ' || this.current[indentEnd] === '\t'))
      indentEnd++
    if (indentEnd === lineStart)
      return false
    const indent = this.current.slice(lineStart, indentEnd)
    if (columnWidth(indent) < TAB_COLUMNS)
      return false
    const swapped = [...indent]
      .map(character => (character === '\t' ? this.chars.tab : this.chars.space))
      .join('')
    this.current = this.current.slice(0, lineStart) + swapped + this.current.slice(indentEnd)
    return true
  }
}

export function createIndentationMask(source: string): IndentationMask | null {
  const [space, tab] = freeCharacters(source, 2)
  if (space == null || tab == null)
    return null
  return new Mask(source, { space, tab })
}

/** Blocks whose marker upstream reads only up to three columns deep. */
const DEEP_MARKERS = new Set(['heading', 'blockquote', 'code'])

/**
 * Marks the lines a parse only reads because micromark ignores their depth:
 * a block whose marker sits four or more columns in, and the indentation a
 * paragraph keeps as text. `mask.text` is parsed again, so one round can
 * uncover a block the previous round hid.
 */
export function markDeepIndentedBlocks(nodes: readonly MdNode[], mask: IndentationMask): boolean {
  let changed = false
  for (const node of nodes) {
    if (node.type === 'paragraph') {
      if (mask.mark(node))
        changed = true
      continue
    }
    if (!DEEP_MARKERS.has(node.type) && node.type !== 'list')
      continue
    const start = node.position?.start?.offset
    if (start == null)
      continue
    // A tab is no indentation to upstream, so `\t- a` is a paragraph there
    // while four spaces still open a list.
    const indent = lineIndent(mask.text, start)
    const deep = columnWidth(indent) >= TAB_COLUMNS && (node.type !== 'list' || indent.includes('\t'))
    if (!deep)
      continue
    if (mask.mark(node))
      changed = true
  }
  return changed
}

/** Puts swapped indentation back into every text value of the tree. */
export function restoreIndentation(root: MdNode, mask: IndentationMask): MdNode {
  const visit = (node: MdNode): MdNode => {
    const children = node.children?.map(visit)
    const value = node.value == null ? node.value : mask.restore(node.value)
    if (value === node.value && (children == null || children.every((child, index) => child === node.children?.[index])))
      return node
    return { ...node, ...(value === node.value ? {} : { value }), ...(children == null ? {} : { children }) }
  }
  return visit(root)
}

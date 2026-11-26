/**
 * A small reader for the `<template>` of a Vue single-file component: enough
 * structure (tags, attributes, parents, children, lines) for checks that judge
 * markup, without a compiler dependency. It never evaluates an expression; an
 * attribute value is kept as written.
 */

export interface TemplateAttr {
  /** The name as written: `label`, `:label`, `@click.stop`, `v-bind`. */
  name: string
  /** The value as written, or null for a bare attribute. */
  value: string | null
}

export interface TemplateElement {
  tag: string
  attrs: TemplateAttr[]
  /** One-based line in the whole file. */
  line: number
  parent: TemplateElement | null
  children: TemplateNode[]
}

export interface TemplateText {
  text: string
}

export type TemplateNode = TemplateElement | TemplateText

/** Elements HTML closes on its own, so they never hold children. */
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

export function isElement(node: TemplateNode): node is TemplateElement {
  return 'tag' in node
}

/**
 * The root `<template>` block of a component and the line it starts on, or null
 * when the file has none or writes it in another language (`lang="pug"`).
 */
export function templateBlock(source: string): { content: string, line: number } | null {
  const open = /^<template(\s[^>]*)?>/m.exec(source)
  if (!open)
    return null
  if (/\blang\s*=\s*["']?(?!html)\w/.test(open[1] ?? ''))
    return null
  const start = open.index + open[0].length
  const close = source.lastIndexOf('\n</template>')
  if (close < start)
    return null
  return { content: source.slice(start, close), line: lineAt(source, start) }
}

/** Reads a template's markup into a tree under a nameless root. */
export function parseTemplate(content: string, firstLine: number): TemplateElement {
  const root: TemplateElement = { tag: '', attrs: [], line: firstLine, parent: null, children: [] }
  let current = root
  let index = 0
  let line = firstLine
  let text = ''

  const advanceTo = (next: number): void => {
    for (let at = index; at < next; at++) {
      if (content[at] === '\n')
        line++
    }
    index = next
  }
  const flushText = (): void => {
    if (text.trim())
      current.children.push({ text })
    text = ''
  }

  while (index < content.length) {
    if (content.startsWith('<!--', index)) {
      const end = content.indexOf('-->', index + 4)
      advanceTo(end === -1 ? content.length : end + 3)
      continue
    }
    if (content.startsWith('{{', index)) {
      const end = content.indexOf('}}', index + 2)
      const next = end === -1 ? content.length : end + 2
      text += content.slice(index, next)
      advanceTo(next)
      continue
    }
    const closing = /^<\/([A-Z][\w.:-]*)\s*>/i.exec(content.slice(index, index + 200))
    if (closing) {
      flushText()
      const tag = closing[1]!
      let open: TemplateElement | null = current
      while (open && open !== root && open.tag !== tag)
        open = open.parent
      if (open && open !== root)
        current = open.parent ?? root
      advanceTo(index + closing[0].length)
      continue
    }
    const opening = /^<([A-Z][\w.:-]*)/i.exec(content.slice(index, index + 200))
    if (opening) {
      flushText()
      const element: TemplateElement = { tag: opening[1]!, attrs: [], line, parent: current, children: [] }
      advanceTo(index + opening[0].length)
      const selfClosing = readAttributes(element)
      current.children.push(element)
      if (!selfClosing && !VOID_ELEMENTS.has(element.tag.toLowerCase()))
        current = element
      continue
    }
    text += content[index]
    advanceTo(index + 1)
  }
  flushText()
  return root

  /** Reads attributes up to the end of the tag; true when the tag closes itself. */
  function readAttributes(element: TemplateElement): boolean {
    while (index < content.length) {
      const space = /^\s+/.exec(content.slice(index, index + 200))
      if (space) {
        advanceTo(index + space[0].length)
        continue
      }
      if (content.startsWith('/>', index)) {
        advanceTo(index + 2)
        return true
      }
      if (content[index] === '>') {
        advanceTo(index + 1)
        return false
      }
      const name = /^[^\s=/>]+/.exec(content.slice(index, index + 200))?.[0] ?? content[index]!
      advanceTo(index + name.length)
      let value: string | null = null
      const equals = /^\s*=\s*/.exec(content.slice(index, index + 50))
      if (equals) {
        advanceTo(index + equals[0].length)
        const quote = content[index]
        if (quote === '"' || quote === '\'') {
          const end = content.indexOf(quote, index + 1)
          const next = end === -1 ? content.length : end + 1
          value = content.slice(index + 1, end === -1 ? content.length : end)
          advanceTo(next)
        }
        else {
          value = /^[^\s>]*/.exec(content.slice(index))?.[0] ?? ''
          advanceTo(index + value.length)
        }
      }
      element.attrs.push({ name, value })
    }
    return false
  }
}

function lineAt(source: string, offset: number): number {
  let line = 1
  for (let index = 0; index < offset; index++) {
    if (source[index] === '\n')
      line++
  }
  return line
}

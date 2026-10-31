import type { SyntaxToken } from '@astryx-vue/core'

interface TextSlice {
  node: Text
  start: number
  length: number
}

interface Applied {
  highlight: Highlight
  range: Range
}

interface HighlightHost {
  highlights: {
    get: (name: string) => Highlight | undefined
    set: (name: string, highlight: Highlight) => void
  }
}

function highlightFor(type: string): Highlight | null {
  const host = (CSS as unknown as Partial<HighlightHost>).highlights
  if (host === undefined)
    return null
  const name = `astryx-${type}`
  let highlight = host.get(name)
  if (highlight === undefined) {
    highlight = new Highlight()
    host.set(name, highlight)
  }
  return highlight
}

/** 一个整体偏移落在哪个文字节点的第几个字符。 */
function resolveOffset(slices: readonly TextSlice[], offset: number): { node: Text, offset: number } | null {
  for (const slice of slices) {
    if (offset >= slice.start && offset <= slice.start + slice.length)
      return { node: slice.node, offset: offset - slice.start }
  }
  return null
}

/**
 * 给「一整块平铺的文字」上色：元素里没有 `[data-line]` 这样的分行结构，
 * 文字可能是好几个文字节点，也可能是一个带 `\n` 的大节点。
 * 把每行的 token 偏移换算成整块文字里的偏移，再落到具体的文字节点上。
 * 返回一个函数，调用后撤掉这次加的全部范围。
 *
 * core 的 `applyHighlightRanges` 只认 `[data-line]` 结构，编辑器里的代码块不是那种结构，所以单独写这个。
 */
export function applyFlatHighlightRanges(element: HTMLElement, tokenLines: SyntaxToken[][]): () => void {
  const applied: Applied[] = []
  const slices: TextSlice[] = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let total = 0
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    const text = node as Text
    slices.push({ node: text, start: total, length: text.length })
    total += text.length
  }

  const cleanup = (): void => {
    for (const { highlight, range } of applied)
      highlight.delete(range)
  }
  if (slices.length === 0)
    return cleanup

  const fullText = element.textContent ?? ''
  let lineOffset = 0
  for (const line of tokenLines) {
    for (const token of line) {
      const start = resolveOffset(slices, lineOffset + token.start)
      const end = resolveOffset(slices, lineOffset + token.end)
      const highlight = highlightFor(token.type)
      if (start === null || end === null || highlight === null)
        continue
      try {
        const range = new Range()
        range.setStart(start.node, start.offset)
        range.setEnd(end.node, end.offset)
        highlight.add(range)
        applied.push({ highlight, range })
      }
      catch {
        // 引擎不接受的范围，这一段保持代码的默认颜色。
      }
    }
    // 跳过这一行和它后面的 \n。
    const newline = fullText.indexOf('\n', lineOffset)
    lineOffset = newline === -1 ? fullText.length : newline + 1
  }
  return cleanup
}

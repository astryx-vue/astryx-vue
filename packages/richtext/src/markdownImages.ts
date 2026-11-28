import type { ElementNode, LexicalNode } from 'lexical'
import { parseInlineAst } from '@astryx-vue/core/Markdown/parser'
import { $getState, $isTextNode, $setState, createState } from 'lexical'
import { codeRanges } from './markdownCodeRanges.js'
import { angleDestinationEnd, pairedDelimiters } from './markdownRefusedLinks.js'
import { absentCharacters } from './markdownStandIns.js'

/**
 * 标记「这段文字装的是一张图片的 Markdown 源码」。导出时原样写回，不转义，所以它仍然是图片。
 * 富文本没有图片节点：图片作为一个整体的文字块（token）进来，整块删除、光标进不去、自动链接也不碰。
 */
const imageSourceState = createState('astryxMdImage', {
  parse: (value: unknown): boolean => value === true,
})

/** `node` 是否是装着图片源码的文字。 */
export function $isImageSource(node: LexicalNode): boolean {
  return $isTextNode(node) && $getState(node, imageSourceState)
}

/**
 * 把代码之外的每张图片换成一个私用区占位字符，并记下每个占位字符替掉的源码。
 * 图片以没被转义的 `!` 开头，后面是配对的方括号。行内图片（`![a](b)`）以目的地和标题收尾，
 * 由 core 的行内解析器整块读出；引用图片（`![a][b]`、`![a][]`、`![a]`）以标签收尾，
 * 它的定义可能在别的块里，所以不管有没有定义都保留。链接包着图片时，链接自己的方括号不动，图片留在链接文字里。
 */
export function protectImages(markdown: string): {
  readonly markdown: string
  readonly images: ReadonlyMap<string, string>
} {
  const images = new Map<string, string>()
  if (!markdown.includes('![')) {
    return { markdown, images }
  }
  const pair = pairedDelimiters(markdown, codeRanges(markdown))
  const found: Array<{ readonly start: number, readonly end: number }> = []
  for (
    let start = markdown.indexOf('![');
    start !== -1;
    start = markdown.indexOf('![', start + 1)
  ) {
    const open = start + 1
    const textClose = pair[open]
    if (textClose === -1 || textClose < open) {
      continue
    }
    // 另一张图片文字里的图片，归外面那张。
    if (found.length > 0 && start < found[found.length - 1]!.end) {
      continue
    }
    let backslashes = 0
    while (markdown[start - 1 - backslashes] === '\\') {
      backslashes++
    }
    if (backslashes % 2 === 1) {
      continue
    }
    const after = markdown[textClose + 1]
    if (after === '(') {
      const angleClose = angleDestinationEnd(markdown, textClose + 1)
      const close = typeof angleClose === 'number' ? angleClose : pair[textClose + 1]!
      if (close === -1 || angleClose === 'refused') {
        continue
      }
      const [only, ...rest] = parseInlineAst(markdown.slice(start, close + 1))
      if (rest.length > 0 || only?.type !== 'image') {
        continue
      }
      found.push({ start, end: close + 1 })
    }
    else if (after === '[' && pair[textClose + 1]! > textClose + 1) {
      found.push({ start, end: pair[textClose + 1]! + 1 })
    }
    else {
      found.push({ start, end: textClose + 1 })
    }
  }
  if (found.length === 0) {
    return { markdown, images }
  }
  const available = absentCharacters(markdown)
  let output = ''
  let copied = 0
  for (const { start, end } of found) {
    const next = available.next()
    if (next.done === true) {
      break
    }
    images.set(next.value, markdown.slice(start, end))
    output += markdown.slice(copied, start) + next.value
    copied = end
  }
  return { markdown: output + markdown.slice(copied), images }
}

/**
 * 把每张图片的源码放回 `node` 下它的占位字符所在的位置，做成标了「图片源码」的文字块。
 * 整块删除，自动链接不碰它的网址；ImageSourceCaretPlugin 让光标进不去，所以输入不会把它替换掉。
 */
export function $restoreImages(
  node: ElementNode,
  images: ReadonlyMap<string, string>,
): void {
  if (images.size === 0) {
    return
  }
  for (const text of node.getAllTextNodes()) {
    const content = text.getTextContent()
    const offsets: number[] = []
    let offset = 0
    for (const character of content) {
      if (images.has(character)) {
        offsets.push(offset, offset + character.length)
      }
      offset += character.length
    }
    if (offsets.length === 0) {
      continue
    }
    const pieces = text.splitText(
      ...offsets.filter(point => point > 0 && point < content.length),
    )
    for (const piece of pieces) {
      const source = images.get(piece.getTextContent())
      if (source == null) {
        continue
      }
      piece.setTextContent(source)
      piece.setMode('token')
      $setState(piece, imageSourceState, true)
    }
  }
}

// 引用图片末尾的标签：`![a][b]` 里的 `[b]`。
const IMAGE_LABEL_END = /\]\[(?:[^\\\]]|\\.)*\]$/

/**
 * 导出时图片源码怎么写。简写引用图片（`![a]`）紧跟链接时写成折叠形式（`![a][]`），
 * 链接的文字就不会被读成它的标签。
 */
export function $imageSourceForExport(node: LexicalNode, nextIsLink: boolean): string {
  const source = node.getTextContent()
  const isShortcut = source.endsWith(']') && !IMAGE_LABEL_END.test(source)
  return isShortcut && nextIsLink ? `${source}[]` : source
}

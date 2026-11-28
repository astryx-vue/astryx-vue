// 往代码块里粘贴富内容时只留纯文本：代码块里不该出现加粗、链接或表格。

import type { BaseSelection, LexicalEditor, LexicalNode, RangeSelection } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import {
  $addUpdateTag,
  $findMatchingParent,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isSelectionCapturedInDecoratorInput,

  COMMAND_PRIORITY_LOW,
  isDOMNode,

  mergeRegister,
  PASTE_COMMAND,
  PASTE_TAG,

  SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,
} from 'lexical'

/** Clipboard types that carry more than plain text. */
const RICH_TYPES = ['text/html', 'application/x-lexical-editor']

/** Whether content inserted at the selection lands in a code block. */
export function $startsInCodeBlock(
  selection: BaseSelection | null,
): selection is RangeSelection {
  if (!$isRangeSelection(selection)) {
    return false
  }
  const start = selection.isBackward() ? selection.focus : selection.anchor
  const node = start.getNode()
  // A link (an autolinked URL) can sit between the text and its code block.
  return $findMatchingParent(node, $isCodeNode) !== null
}

/**
 * Clipboard nodes as plain lines: each block's text on a line of its own (a
 * paragraph, a heading, a list item, a table cell), and inline content
 * between blocks on one line.
 */
function $plainLinesOf(nodes: ReadonlyArray<LexicalNode>): string {
  const lines: string[] = []
  let inline: string | null = null
  const endInline = (): void => {
    if (inline != null) {
      lines.push(inline)
      inline = null
    }
  }
  const visit = (node: LexicalNode): void => {
    if (node.isInline()) {
      inline = (inline ?? '') + node.getTextContent()
      return
    }
    endInline()
    if (
      $isElementNode(node)
      && node.getChildren().some(child => !child.isInline())
    ) {
      node.getChildren().forEach(visit)
      endInline()
    }
    else {
      lines.push(node.getTextContent())
    }
  }
  nodes.forEach(visit)
  endInline()
  return lines.join('\n')
}

/** 注册代码块里的纯文本粘贴。 */
export function registerCodePaste(editor: LexicalEditor): () => void {
  return mergeRegister(
    // 排在富文本粘贴前面，它有富内容时会插入富内容。
    editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        // 装饰节点自己渲染的输入框里的粘贴归它自己。
        if (
          isDOMNode(event.target)
          && $isSelectionCapturedInDecoratorInput(event.target)
        ) {
          return false
        }
        const data = 'clipboardData' in event ? event.clipboardData : null
        if (
          !editor.isEditable()
          || data == null
          || !RICH_TYPES.some(type => data.types.includes(type))
        ) {
          return false
        }
        const text = data.getData('text/plain')
        const selection = $getSelection()
        if (text === '' || !$startsInCodeBlock(selection)) {
          return false
        }
        event.preventDefault()
        $addUpdateTag(PASTE_TAG)
        selection.insertRawText(text)
        return true
      },
      COMMAND_PRIORITY_LOW,
    ),
    // 没有纯文本的粘贴和拖放都走这里；排在表格自己的处理前面。
    editor.registerCommand(
      SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,
      ({ nodes, selection }) => {
        if (!$startsInCodeBlock(selection)) {
          return false
        }
        selection.insertRawText($plainLinesOf(nodes))
        return true
      },
      COMMAND_PRIORITY_LOW,
    ),
  )
}

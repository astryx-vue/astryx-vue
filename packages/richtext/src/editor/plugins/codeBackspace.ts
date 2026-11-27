import type { CodeNode } from '@lexical/code'

// 光标在代码块开头按 Backspace，把代码块变回段落，而不是和上一块合并。
import type { LexicalEditor, ParagraphNode } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  DELETE_CHARACTER_COMMAND,

} from 'lexical'

/** Start is offset 0 of the block or of its first child, not the start of a later line. */
function $codeBlockAtCaretStart(): CodeNode | null {
  const selection = $getSelection()
  if (
    !$isRangeSelection(selection)
    || !selection.isCollapsed()
    || selection.anchor.offset !== 0
  ) {
    return null
  }
  const node = selection.anchor.getNode()
  const code = $isCodeNode(node) ? node : node.getParent()
  if (!$isCodeNode(code)) {
    return null
  }
  return node.is(code) || node.is(code.getFirstChild()) ? code : null
}

/**
 * A newline inside text exports as a soft break, and the lines read back as
 * one. A line break node exports as a hard break. Empty lines at the end of
 * the code are dropped: a hard break that ends a paragraph reads back as a
 * literal backslash.
 */
function $paragraphOfLines(code: CodeNode): ParagraphNode {
  const paragraph = $createParagraphNode()
  code
    .getTextContent()
    .replace(/\n+$/, '')
    .split('\n')
    .forEach((line, index) => {
      if (index > 0) {
        paragraph.append($createLineBreakNode())
      }
      if (line !== '') {
        paragraph.append($createTextNode(line))
      }
    })
  return paragraph
}

/** 注册代码块开头的 Backspace。 */
export function registerCodeBackspace(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    DELETE_CHARACTER_COMMAND,
    (isBackward) => {
      if (!isBackward || !editor.isEditable()) {
        return false
      }
      const code = $codeBlockAtCaretStart()
      if (code == null) {
        return false
      }
      const paragraph = $paragraphOfLines(code)
      code.replace(paragraph)
      paragraph.selectStart()
      return true
    },
    // 排在富文本自带的删除前面，它会做合并。
    COMMAND_PRIORITY_LOW,
  )
}

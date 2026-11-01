import type { ElementNode, LexicalEditor, LexicalNode, Point } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import { $isTableNode } from '@lexical/table'
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_HIGH,
  KEY_ARROW_DOWN_COMMAND,
} from 'lexical'

function isCodeOrTable(node: LexicalNode | null): node is ElementNode {
  return node != null && ($isCodeNode(node) || $isTableNode(node))
}

function shouldInsertAfterBlock(node: LexicalNode): node is ElementNode {
  return isCodeOrTable(node) && (node.getNextSibling() === null || isCodeOrTable(node.getNextSibling()))
}

function isAtEnd(point: Point, block: ElementNode): boolean {
  const last = block.getLastDescendant()
  if ($isTextNode(last))
    return point.key === last.getKey() && point.offset === last.getTextContentSize()
  const element = $isElementNode(last) ? last : last?.getParent()
  return element != null && point.key === element.getKey() && point.offset === element.getChildrenSize()
}

export function registerBlockExit(editor: LexicalEditor): () => void {
  return editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (event) => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection) || !selection.isCollapsed())
      return false
    const anchor = selection.anchor.getNode()
    const block = [anchor, ...anchor.getParents()].find(shouldInsertAfterBlock)
    const parent = block?.getParent()
    if (!block || !parent || !isAtEnd(selection.anchor, block))
      return false
    const paragraph = $createParagraphNode()
    parent.splice(block.getIndexWithinParent() + 1, 0, [paragraph])
    paragraph.select()
    event.preventDefault()
    return true
  }, COMMAND_PRIORITY_HIGH)
}

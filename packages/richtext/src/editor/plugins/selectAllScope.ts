// Cmd/Ctrl+A 先选中光标所在的代码块或表格单元格，再按一次才选整篇文档。

import type { ElementNode, LexicalEditor, LexicalNode } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import { $isTableCellNode } from '@lexical/table'
import {
  $getSelection,
  $isBlockFullySelected,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,

  SELECT_ALL_COMMAND,
} from 'lexical'

/** Whether select all stops at `node` before taking the whole document. */
function $isScope(node: LexicalNode): node is ElementNode {
  return $isCodeNode(node) || $isTableCellNode(node)
}

/** The scopes holding `node`, innermost first. */
function $scopesOf(node: LexicalNode): Array<ElementNode> {
  const scopes: Array<ElementNode> = []
  for (let at: LexicalNode | null = node; at !== null; at = at.getParent()) {
    if ($isScope(at)) {
      scopes.push(at)
    }
  }
  return scopes
}

/**
 * Selects the content of the innermost scope that holds the whole selection
 * and is not yet fully selected; false, to let the document be selected,
 * when there is none.
 */
function $selectScope(): boolean {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) {
    return false
  }
  const focusScopes = $scopesOf(selection.focus.getNode())
  for (const scope of $scopesOf(selection.anchor.getNode())) {
    if (
      focusScopes.some(each => each.is(scope))
      && !$isBlockFullySelected(scope, selection)
    ) {
      scope.select(0, scope.getChildrenSize())
      return true
    }
  }
  return false
}

export function registerSelectAllScope(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    SELECT_ALL_COMMAND,
    () => editor.isEditable() && $selectScope(),
    COMMAND_PRIORITY_NORMAL,
  )
}

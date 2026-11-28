// Lexical 会用输入的文字替换整个 token。光标在图片源码里面时，输入会把图片整张换掉，
// 所以光标进了图片源码就挪到它的边上：方向键进来的，穿过去；点击和其他移动，去较近的一边。
import type { LexicalEditor, NodeKey, TextNode } from 'lexical'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  mergeRegister,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { $isImageSource } from '../../markdownImages.js'

interface CaretPoint {
  readonly key: NodeKey
  readonly offset: number
}

/** 收起的光标，在文字里时。 */
function $caretPoint(): CaretPoint | null {
  const selection = $getSelection()
  return $isRangeSelection(selection)
    && selection.isCollapsed()
    && selection.anchor.type === 'text'
    ? { key: selection.anchor.key, offset: selection.anchor.offset }
    : null
}

/**
 * 在 `token` 里 `offset` 处的光标要去它的哪一边。方向键从一边或旁边的文字把光标挪进来时，
 * 继续挪到另一边。
 */
function $edgeFor(token: TextNode, offset: number, arrowFrom: CaretPoint | null): number {
  const size = token.getTextContentSize()
  const nearer = offset < size / 2 ? 0 : size
  if (arrowFrom == null) {
    return nearer
  }
  if (arrowFrom.key === token.getKey()) {
    if (arrowFrom.offset === 0) {
      return size
    }
    return arrowFrom.offset === size ? 0 : nearer
  }
  const before = token.getPreviousSibling()
  if (before != null && before.getKey() === arrowFrom.key && arrowFrom.offset === before.getTextContentSize()) {
    return size
  }
  const after = token.getNextSibling()
  if (after != null && after.getKey() === arrowFrom.key && arrowFrom.offset === 0) {
    return 0
  }
  return nearer
}

/** 把图片源码里面的收起光标挪到它的一边。 */
function $moveCaretOutOfImage(arrowFrom: CaretPoint | null): void {
  const caret = $caretPoint()
  if (caret == null) {
    return
  }
  const node = $getNodeByKey<TextNode>(caret.key)
  if (node == null || !$isImageSource(node) || caret.offset === 0 || caret.offset === node.getTextContentSize()) {
    return
  }
  const edge = $edgeFor(node, caret.offset, arrowFrom)
  const selection = $getSelection()
  if ($isRangeSelection(selection)) {
    selection.anchor.set(caret.key, edge, 'text')
    selection.focus.set(caret.key, edge, 'text')
  }
}

/** 让收起的光标待在装着图片源码的文字之外。返回取消注册的函数。 */
export function registerImageSourceCaret(editor: LexicalEditor): () => void {
  // 方向键按下时光标在哪里；下一次选区变化读它一次。按下鼠标算点击，不算方向键。
  let arrowFrom: CaretPoint | null = null
  const onKeyDown = (event: KeyboardEvent): void => {
    arrowFrom = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
      ? editor.getEditorState().read($caretPoint)
      : null
  }
  const onPointerDown = (): void => {
    arrowFrom = null
  }
  return mergeRegister(
    editor.registerRootListener((root, previousRoot) => {
      previousRoot?.removeEventListener('keydown', onKeyDown, true)
      previousRoot?.removeEventListener('pointerdown', onPointerDown, true)
      root?.addEventListener('keydown', onKeyDown, true)
      root?.addEventListener('pointerdown', onPointerDown, true)
    }),
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $moveCaretOutOfImage(arrowFrom)
        arrowFrom = null
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
    // 浏览器过一帧才报告光标移动，期间敲的键到达编辑器时光标还在源码里面。
    editor.registerCommand(
      CONTROLLED_TEXT_INSERTION_COMMAND,
      () => {
        $moveCaretOutOfImage(null)
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
  )
}

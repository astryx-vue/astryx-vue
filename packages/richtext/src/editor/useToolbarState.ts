import type { LinkNode } from '@lexical/link'
import type { LexicalEditor, RangeSelection } from 'lexical'
import type { Ref } from 'vue'
import { $isLinkNode } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { onBeforeUnmount, shallowRef } from 'vue'
import { $selectedExtensionNodesOnly } from '../markdownExtensionNode.js'

/** 工具栏里「块格式」下拉能选的几种。 */
export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote' | 'bullet' | 'number'

export type InlineFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code'

export const INLINE_FORMATS: readonly InlineFormat[] = ['bold', 'italic', 'underline', 'strikethrough', 'code']

/** 光标或选区当前落在链接里时，链接的情况。 */
export interface LinkContext {
  selectedText: string
  url: string
  isLink: boolean
}

export interface ToolbarState {
  /** 选区里哪些行内格式是开着的。 */
  activeFormats: Ref<ReadonlySet<InlineFormat>>
  blockType: Ref<BlockType>
  isLink: Ref<boolean>
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  isEditable: Ref<boolean>
  /** 最近一次读到的选区，对话框打开后用它把选区放回去。 */
  savedSelection: Ref<RangeSelection | null>
  lastLinkContext: Ref<LinkContext>
  /** 现在就读一次选区里的链接情况（对话框打开前调用）。 */
  readLinkContext: () => LinkContext
}

/** 光标所在的链接节点：光标在链接文字里（父节点是链接），或选区就是链接本身。 */
function $linkAt(selection: RangeSelection): LinkNode | null {
  const node = selection.anchor.getNode()
  const parent = node.getParent()
  if ($isLinkNode(node))
    return node
  return $isLinkNode(parent) ? parent : null
}

/**
 * 让工具栏跟着选区走：哪些格式开着、当前块是什么、能不能撤销重做、是不是可编辑、
 * 光标是不是在链接里。编辑器每次更新、选区每次变化都重新读一遍。
 */
export function useToolbarState(editor: LexicalEditor): ToolbarState {
  const activeFormats = shallowRef<ReadonlySet<InlineFormat>>(new Set())
  const blockType = shallowRef<BlockType>('paragraph')
  const isLink = shallowRef(false)
  const canUndo = shallowRef(false)
  const canRedo = shallowRef(false)
  const isEditable = shallowRef(editor.isEditable())
  const savedSelection = shallowRef<RangeSelection | null>(null)
  const lastLinkContext = shallowRef<LinkContext>({ selectedText: '', url: '', isLink: false })

  function $sync(): void {
    const selection = $getSelection()
    if (!$isRangeSelection(selection) && !$isNodeSelection(selection))
      return

    // 只选中了 Markdown 插件节点（框选或点选）时，显示的是它们的格式；
    // 其他节点选区（比如分割线）没有格式。
    const nodesOnly = $selectedExtensionNodesOnly(selection)
    const formats = new Set<InlineFormat>()
    for (const format of INLINE_FORMATS) {
      const on = nodesOnly !== null
        ? nodesOnly.every(node => node.hasFormat(format))
        : $isRangeSelection(selection) && selection.hasFormat(format)
      if (on)
        formats.add(format)
    }
    activeFormats.value = formats
    if (!$isRangeSelection(selection))
      return

    const link = $linkAt(selection)
    isLink.value = link !== null
    savedSelection.value = selection.clone()
    lastLinkContext.value = { selectedText: selection.getTextContent(), url: link?.getURL() ?? '', isLink: link !== null }

    const anchorNode = selection.anchor.getNode()
    const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
    if ($isListNode(element)) {
      const list = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
      blockType.value = (list ?? element).getListType() === 'number' ? 'number' : 'bullet'
    }
    else if ($isHeadingNode(element)) {
      blockType.value = element.getTag() as BlockType
    }
    else {
      blockType.value = $isQuoteNode(element) ? 'quote' : 'paragraph'
    }
  }

  const stop = mergeRegister(
    editor.registerUpdateListener(({ editorState }) => editorState.read($sync)),
    editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
      $sync()
      return false
    }, COMMAND_PRIORITY_CRITICAL),
    editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
      canUndo.value = payload
      return false
    }, COMMAND_PRIORITY_CRITICAL),
    editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
      canRedo.value = payload
      return false
    }, COMMAND_PRIORITY_CRITICAL),
    editor.registerEditableListener((editable) => {
      isEditable.value = editable
    }),
  )
  onBeforeUnmount(stop)

  function readLinkContext(): LinkContext {
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection))
        return
      const link = $linkAt(selection)
      savedSelection.value = selection.clone()
      lastLinkContext.value = { selectedText: selection.getTextContent(), url: link?.getURL() ?? '', isLink: link !== null }
    })
    return lastLinkContext.value
  }

  return { activeFormats, blockType, isLink, canUndo, canRedo, isEditable, savedSelection, lastLinkContext, readLinkContext }
}

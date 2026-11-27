import type { LexicalEditor } from 'lexical'
import type { Ref } from 'vue'
import type { RichTextTranslator } from './messages.js'
import type { ToolbarState } from './useToolbarState.js'
import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $createTextNode, $getSelection, $isRangeSelection, $setSelection } from 'lexical'
import { shallowRef } from 'vue'
import { toLinkHref } from './linkEditing.js'

export interface ToolbarLinkOptions {
  editor: LexicalEditor
  state: ToolbarState
  t: RichTextTranslator
  /** 新建的链接是否带 `target="_blank"` 和 `rel="noopener noreferrer"`。 */
  hasNewTabLinks: () => boolean
  /**
   * 自己提供网址输入界面时用：选中的文字作为提示传进来，返回网址就加链接，
   * 返回空就取消。不传就用内置的弹出层。
   */
  promptForUrl: () => ((selectedText: string) => string | null | undefined) | undefined
  /** 链接按钮外面的那层元素；弹出层从 Cmd/Ctrl+K 打开前，先把它滚进视野。 */
  getAnchor: () => HTMLElement | null
}

export interface ToolbarLink {
  isOpen: Ref<boolean>
  /** 当前是在编辑已有的链接，还是新插入。 */
  isEditing: Ref<boolean>
  url: Ref<string>
  error: Ref<string>
  /** 打开弹出层；设了 `promptForUrl` 就改走它，选区已在链接里则直接取消链接。Cmd/Ctrl+K 调用。 */
  open: () => void
  /** 链接按钮调用：开着就取消，关着就打开。 */
  toggle: () => void
  /** 弹出层自己报告的开合：点外面、Escape 关掉它时会走到这里。 */
  onOpenChange: (open: boolean) => void
  onUrlChange: (url: string) => void
  /** 把输入的网址链到选区；网址被拒绝时返回 false。 */
  apply: () => boolean
  remove: () => void
  /** 关掉弹出层，把焦点和选区还给编辑器。 */
  cancel: () => void
}

/**
 * 工具栏链接弹出层的状态和动作。焦点进了网址输入框，页面的选区就离开了编辑器，
 * 所以打开前先存下选区，链接、取消链接、把焦点还给编辑器之前都先把它放回去。
 */
export function useToolbarLink(options: ToolbarLinkOptions): ToolbarLink {
  const { editor, state, t } = options
  const isOpen = shallowRef(false)
  const isEditing = shallowRef(false)
  const url = shallowRef('')
  const error = shallowRef('')

  function restoreSelection(): void {
    const saved = state.savedSelection.value
    if (saved === null)
      return
    editor.update(() => {
      $setSelection(saved.clone())
    })
  }

  /** 把网址写进选区。网址不安全时什么也不做并返回 false。 */
  function write(entered: string): boolean {
    const trimmed = entered.trim()
    const safe = toLinkHref(trimmed)
    if (safe === null)
      return false

    const attributes = options.hasNewTabLinks() ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    const saved = state.savedSelection.value
    // 放回选区、判断、写入都在同一次 update 里：在指令监听器内（Cmd/Ctrl+K）Lexical 会把 update 排队，
    // 前一次 update 里设的标记管不到后面的代码。
    editor.update(() => {
      if (saved !== null)
        $setSelection(saved.clone())
      const selection = $getSelection()
      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const node = selection.anchor.getNode()
        // 光标在链接外：没有文字可链，网址本身就是链接文字。
        // 切换指令会把光标所在的整段文字都链起来。光标在链接里则交给切换指令去更新那条链接。
        if (!$isLinkNode(node) && !$isLinkNode(node.getParent())) {
          const link = $createLinkNode(safe, attributes)
          link.append($createTextNode(trimmed))
          selection.insertNodes([link])
          return
        }
      }
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: safe, ...attributes })
    })
    return true
  }

  function close(): void {
    isOpen.value = false
    error.value = ''
  }

  /** 先让可编辑的根元素拿到焦点，Lexical 再把选区画回去，输入框占过页面选区也不碍事。 */
  function closeToEditor(): void {
    editor.getRootElement()?.focus({ preventScroll: true })
    editor.focus()
    close()
  }

  function open(): void {
    if (!editor.isEditable())
      return
    const context = state.readLinkContext()
    const prompt = options.promptForUrl()
    if (prompt !== undefined) {
      if (context.isLink) {
        restoreSelection()
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        return
      }
      const entered = prompt(context.selectedText)
      if (entered != null && entered.trim() !== '')
        write(entered)
      return
    }
    // 输入框从链接原来的地址开始，或者从本来就像网址的选中文字开始；否则留空，显示占位文字。
    url.value = context.url || (context.selectedText.startsWith('http') ? context.selectedText : '')
    isEditing.value = context.isLink
    error.value = ''
    // Cmd/Ctrl+K 打开时链接按钮可能已经滚出页面或工具栏那一行，先拉回来，弹出层才开在它旁边。
    options.getAnchor()?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    isOpen.value = true
  }

  function cancel(): void {
    restoreSelection()
    closeToEditor()
  }

  function toggle(): void {
    if (isOpen.value)
      cancel()
    else
      open()
  }

  function onOpenChange(next: boolean): void {
    if (next)
      open()
    else
      close()
  }

  function onUrlChange(value: string): void {
    url.value = value
    error.value = ''
  }

  function apply(): boolean {
    if (!write(url.value)) {
      error.value = t('link.invalidUrl')
      return false
    }
    closeToEditor()
    return true
  }

  function remove(): void {
    restoreSelection()
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    closeToEditor()
  }

  return { isOpen, isEditing, url, error, open, toggle, onOpenChange, onUrlChange, apply, remove, cancel }
}

import type { LexicalEditor } from 'lexical'
import type { Ref } from 'vue'
import type { RichTextTranslator } from './messages.js'
import type { ToolbarState } from './useToolbarState.js'
import { $createLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $createTextNode, $getSelection, $isRangeSelection, $setSelection } from 'lexical'
import { shallowRef } from 'vue'
import { sanitizeUrl } from '../linkUtils.js'

export interface LinkDialogOptions {
  editor: LexicalEditor
  state: ToolbarState
  t: RichTextTranslator
  /** 新建的链接是否带 `target="_blank"` 和 `rel="noopener noreferrer"`。 */
  hasNewTabLinks: () => boolean
  /**
   * 自己提供网址输入界面时用：选中的文字作为提示传进来，返回网址就加链接，
   * 返回空就取消。不传就用内置的对话框。
   */
  promptForUrl: () => ((selectedText: string) => string | null | undefined) | undefined
}

export interface LinkDialog {
  isOpen: Ref<boolean>
  /** 当前是在编辑已有的链接，还是新插入。 */
  isEditing: Ref<boolean>
  url: Ref<string>
  error: Ref<string>
  /** 链接按钮和 Cmd/Ctrl+K 调用：打开对话框，或者走 `promptForUrl`。 */
  toggle: () => void
  setOpen: (open: boolean) => void
  /** 对话框提交。返回是否成功关闭。 */
  submit: () => boolean
  remove: () => void
}

/**
 * 链接对话框的状态和动作。对话框一打开编辑器就失焦、选区没了，
 * 所以打开前先存下选区，提交时放回去，再下指令。
 */
export function useLinkDialog(options: LinkDialogOptions): LinkDialog {
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
  function apply(entered: string): boolean {
    const trimmed = entered.trim()
    const safe = sanitizeUrl(trimmed)
    if (safe === 'about:blank')
      return false

    restoreSelection()
    const attributes = options.hasNewTabLinks() ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    const handled = editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: safe, ...attributes })
    if (!handled) {
      // 选区是光标（没选文字）时，指令不会生效；这时把网址本身当链接文字插进去。
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const node = $createLinkNode(safe, attributes)
          node.append($createTextNode(trimmed))
          selection.insertNodes([node])
        }
      })
    }
    return true
  }

  function closeToEditor(): void {
    isOpen.value = false
    error.value = ''
    // 等对话框收起、焦点还回去之后再聚焦，不然会被对话框抢走。
    requestAnimationFrame(() => editor.focus())
  }

  function toggle(): void {
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
        apply(entered)
      return
    }
    url.value = context.url || (context.selectedText.startsWith('http') ? context.selectedText : 'https://')
    isEditing.value = context.isLink
    error.value = ''
    isOpen.value = true
  }

  function setOpen(open: boolean): void {
    isOpen.value = open
    error.value = ''
  }

  function submit(): boolean {
    if (!apply(url.value)) {
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

  return { isOpen, isEditing, url, error, toggle, setOpen, submit, remove }
}

import type { LexicalEditor } from 'lexical'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

/** 编辑器根组件把 Lexical 编辑器挂在这个键上，工具栏和插件组件从它取。 */
export const editorKey: InjectionKey<LexicalEditor | (() => LexicalEditor | null)> = Symbol('astryx-richtext-editor')

/** 读当前的 Lexical 编辑器。只能在 `<RichTextEditor>` 或 `<RichTextView>` 里面用。 */
export function useLexicalEditor(): LexicalEditor {
  const provided = inject(editorKey, null)
  // 编辑器根组件提供的是编辑器本身；只读视图提供的是一个 getter（出错再恢复时编辑器会换）。
  const editor = typeof provided === 'function' ? provided() : provided
  if (editor === null)
    throw new Error('useLexicalEditor() 必须在 <RichTextEditor> 或 <RichTextView> 里调用，并且编辑器已经建好')
  return editor
}

import type { LexicalEditor } from 'lexical'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

/** 编辑器根组件把 Lexical 编辑器挂在这个键上，工具栏和插件组件从它取。 */
export const editorKey: InjectionKey<LexicalEditor> = Symbol('astryx-richtext-editor')

/** 读当前的 Lexical 编辑器。只能在 `<RichTextEditor>` 里面用。 */
export function useLexicalEditor(): LexicalEditor {
  const editor = inject(editorKey, null)
  if (editor === null)
    throw new Error('useLexicalEditor() 必须在 <RichTextEditor> 里调用')
  return editor
}

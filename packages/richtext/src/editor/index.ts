export { editorKey, useLexicalEditor } from './context.js'
export { createRichTextEditor } from './createEditor.js'
export type { CreateRichTextEditorOptions } from './createEditor.js'
export { RICHTEXT_ICON_KEYS } from './icons.js'
export type { RichTextIconName } from './icons.js'
export { CodeBlockHeaderPlugin, CodeSyntaxPlugin, DEFAULT_LINK_MATCHERS, NEW_TAB_LINK_ATTRIBUTES, RichTextEditorAutoLinkPlugin, TaskCheckboxPlugin } from './plugins/index.js'
export { default as RichTextEditor } from './RichTextEditor.vue'
export { default as RichTextEditorToolbar } from './RichTextEditorToolbar.vue'
export type { RichTextEditorToolbarProps, RichTextEditorToolbarSlots, RichTextToolbarSize } from './toolbarTypes.js'
export type {
  RichTextEditorEmits,
  RichTextEditorExposed,
  RichTextEditorProps,
  RichTextEditorSize,
  RichTextEditorSlots,
  RichTextEditorStatus,
  RichTextEditorStatusType,
} from './types.js'

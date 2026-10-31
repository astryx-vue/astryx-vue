// 包入口：编辑器、Markdown 导入导出、Markdown 插件扩展、链接校验。
// 只读视图和各插件由后续版本补齐。

export { createRichTextEditor, editorKey, RICHTEXT_ICON_KEYS, RichTextEditor, RichTextEditorToolbar, useLexicalEditor } from './editor/index.js'
export type {
  CreateRichTextEditorOptions,
  RichTextEditorEmits,
  RichTextEditorExposed,
  RichTextEditorProps,
  RichTextEditorSize,
  RichTextEditorSlots,
  RichTextEditorStatus,
  RichTextEditorStatusType,
  RichTextEditorToolbarProps,
  RichTextEditorToolbarSlots,
  RichTextIconName,
  RichTextToolbarSize,
} from './editor/index.js'
export { sanitizeUrl, validateUrl } from './linkUtils.js'
export {
  createRichTextExtension,
  RichTextExtensionError,
} from './markdownExtensions.js'
export type { RichTextMarkdownExtension } from './markdownExtensions.js'
export {
  editorStateJSONToMarkdown,
  markdownToEditorStateJSON,
} from './markdownSerializers.js'
export type { MarkdownSerializerOptions } from './markdownSerializers.js'

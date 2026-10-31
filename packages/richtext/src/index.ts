// 包入口：编辑器、Markdown 导入导出、Markdown 插件扩展、链接校验。

export { createRichTextEditor, DEFAULT_LINK_MATCHERS, editorKey, NEW_TAB_LINK_ATTRIBUTES, RICHTEXT_ICON_KEYS, RichTextEditor, RichTextEditorAutoLinkPlugin, RichTextEditorToolbar, RichTextView, useLexicalEditor } from './editor/index.js'
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
  RichTextViewProps,
  RichTextViewSlots,
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

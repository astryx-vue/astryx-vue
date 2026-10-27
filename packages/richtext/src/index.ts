// 包入口。这一版只有和界面无关的部分：Markdown 导入导出、Markdown 插件扩展、链接校验。
// 编辑器和只读视图由后续版本补齐。

export {
  markdownToEditorStateJSON,
  editorStateJSONToMarkdown,
} from './markdownSerializers.js'
export type { MarkdownSerializerOptions } from './markdownSerializers.js'
export {
  createRichTextExtension,
  RichTextExtensionError,
} from './markdownExtensions.js'
export type { RichTextMarkdownExtension } from './markdownExtensions.js'
export { sanitizeUrl, validateUrl } from './linkUtils.js'

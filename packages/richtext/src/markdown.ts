// 服务端可用的入口 `@astryx-vue/richtext/markdown`：Markdown 导入导出函数、
// Markdown 插件扩展和它们的类型。这里不引入 Vue 组件，也不调用 DOM，
// 所以在 Node、Worker 或者服务端渲染里都能用。

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

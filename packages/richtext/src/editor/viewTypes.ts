import type { Klass, LexicalNode } from 'lexical'
import type { RichTextMarkdownExtension } from '../markdownExtensions.js'

export interface RichTextViewProps {
  /** 要渲染的编辑器状态：`JSON.stringify(editorState.toJSON())` 得到的字符串。 */
  value: string
  /** 在默认节点之外额外注册的 Lexical 节点。要和写这份 `value` 时用的一致，自定义节点才读得回来。 */
  nodes?: ReadonlyArray<Klass<LexicalNode>>
  /**
   * 这个视图要画哪些 Markdown 插件的节点，每个都用 `createRichTextExtension` 采用。
   * 插件节点画出来和 core 的 `Markdown` 一样；没在这里给出插件的节点显示它的原文。
   * 传内容转换时用的那些扩展。要在客户端模块里创建：它们带着插件的函数，不是能序列化的 props。
   */
  markdownExtensions?: ReadonlyArray<RichTextMarkdownExtension>
  /**
   * Lexical 编辑器的名字。
   * @default 'astryx-view'
   */
  namespace?: string
}

export interface RichTextViewSlots {
  /**
   * `value` 解析不了（JSON 坏了，或者用了没通过 `nodes` 注册的节点类型）时显示的内容，默认什么也不画。
   * 只读视图读的是持久化的内容，过期或者别的结构的状态恰恰出现在这里，所以不抛错、不带崩宿主页面。
   */
  errorFallback?: () => unknown
  /** 额外的只读内容，渲染在视图里面。放调用 `useLexicalEditor()` 的组件来扩展。 */
  default?: () => unknown
}

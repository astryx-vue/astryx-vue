import type { Transformer } from '@lexical/markdown'
import type { AnyLexicalExtensionArgument, EditorState, Klass, LexicalEditor, LexicalNode } from 'lexical'
import type { RichTextMarkdownExtension } from '../markdownExtensions.js'

export type RichTextEditorStatusType = 'warning' | 'error' | 'success'
export type RichTextEditorSize = 'sm' | 'md' | 'lg'

export interface RichTextEditorStatus {
  /** 状态类型，决定边框颜色。 */
  type: RichTextEditorStatusType
  /** 显示在编辑器下面的说明文字。 */
  message?: string
}

export interface RichTextEditorProps {
  /** 编辑器的标签文字。无障碍用，所以一定要写。 */
  label: string
  /**
   * 是否只对读屏软件显示标签。
   * @default false
   */
  isLabelHidden?: boolean
  /** 标签和编辑区之间的说明文字。 */
  description?: string
  /**
   * 是否选填。和 `isRequired` 互斥。
   * @default false
   */
  isOptional?: boolean
  /**
   * 是否必填。和 `isOptional` 互斥。
   * @default false
   */
  isRequired?: boolean
  /**
   * 初始内容：`JSON.stringify(editorState.toJSON())` 得到的字符串。
   * 编辑器是非受控的，只在创建时读一次。
   */
  defaultValue?: string
  /** 内容为空时显示的提示文字。 */
  placeholder?: string
  /**
   * 是否只读。内容保持原来的不透明度、仍然可以用 Tab 走到、读屏软件读作「只读」，
   * 所以使用者依然能读到、复制到内容。改变后立即生效。
   * @default false
   */
  isReadOnly?: boolean
  /**
   * 是否禁用：不可编辑、变淡、不在 Tab 顺序里、读屏软件读作「禁用」。
   * 和 `isReadOnly` 一起设时以它为准。改变后立即生效。
   * @default false
   */
  isDisabled?: boolean
  /** 状态：有了它编辑器会画出对应颜色的边框；带 `message` 时在下面显示说明。 */
  status?: RichTextEditorStatus
  /**
   * 状态说明相对编辑器怎么放。
   * @default 'attached'
   */
  statusVariant?: 'attached' | 'detached' | 'tooltip'
  /** 整个字段的宽度。数字当像素，字符串原样当 CSS 长度。 */
  width?: number | string
  /**
   * 编辑区的最小高度。数字当像素，字符串原样当 CSS 长度。
   * @default '4.5rem'
   */
  minHeight?: number | string
  /** 标签末尾信息图标里的提示文字。 */
  labelTooltip?: string
  /**
   * 编辑器尺寸，影响内边距。
   * @default 'md'
   */
  size?: RichTextEditorSize
  /** 在默认节点（标题、引用、列表、链接、代码、表格）之外额外注册的 Lexical 节点。 */
  nodes?: ReadonlyArray<Klass<LexicalNode>>
  /**
   * 额外的 Lexical 扩展。想加提及、图片这类功能，写成扩展传进来，
   * 或者在默认插槽里放一个调用 `useLexicalEditor()` 的组件。
   */
  extensions?: ReadonlyArray<AnyLexicalExtensionArgument>
  /**
   * 这个编辑器要画哪些 Markdown 插件的节点，每个都用 `createRichTextExtension` 采用。
   * 插件节点画出来和 core 的 `Markdown` 一样；没在这里给出插件的节点显示它的原文。
   * 传内容转换时用的那些扩展。要在客户端模块里创建：它们带着插件的函数，不是能序列化的 props。
   */
  markdownExtensions?: ReadonlyArray<RichTextMarkdownExtension>
  /**
   * 是否开启 Markdown 快捷输入（输入 `# ` 变标题、`- ` 变列表）。
   * @default true
   */
  hasMarkdownShortcuts?: boolean
  /**
   * Markdown 转换器：快捷输入、导出 Markdown 共用这一份。
   * 默认是 `@lexical/markdown` 的标准转换器加 GFM 表格；传了就整个替换。
   */
  transformers?: ReadonlyArray<Transformer>
  /**
   * 挂载时是否自动聚焦。
   * @default false
   */
  hasAutoFocus?: boolean
  /**
   * 给读屏软件的提示：怎么把焦点移出编辑器（Tab 用来缩进，所以要先按 Escape 再按 Tab）。
   * 视觉上隐藏，由编辑区的 `aria-describedby` 引用。传空字符串则不输出。
   */
  tabEscapeHint?: string
  /**
   * 字数上限。设了之后编辑器下面显示「当前/上限」。和 TextArea 一样不强行截断，
   * 超出后计数变红。字数按纯文本长度算。
   */
  maxLength?: number
  /**
   * Lexical 编辑器的名字，用来区分同一页上的多个编辑器。
   * @default 'astryx-editor'
   */
  namespace?: string
}

export interface RichTextEditorEmits {
  /** 内容变化时触发。参数是最新的编辑器状态和编辑器实例；用 `editorState.toJSON()` 存起来。 */
  change: [editorState: EditorState, editor: LexicalEditor]
}

export interface RichTextEditorSlots {
  /** 放在编辑区上面、顶到两边的工具栏。 */
  toolbar?: () => unknown
  /** 额外的内容，渲染在编辑器里面。放调用 `useLexicalEditor()` 的组件来扩展行为。 */
  default?: () => unknown
}

/** 通过模板引用拿到的方法。 */
export interface RichTextEditorExposed {
  /** 把焦点移进编辑区。只读或禁用时什么也不做。 */
  focus: () => void
  /** 清空内容，回到只有一个空段落。只读或禁用时什么也不做。 */
  clear: () => void
  /** 当前的编辑器状态；用 `.toJSON()` 序列化后保存。 */
  getEditorState: () => EditorState
  /** 导出 Markdown。导入时没动过的块原样导出，改过或新加的块用规范写法。 */
  getMarkdown: () => string
  /** 导出 HTML。需要 DOM。 */
  getHTML: () => string
  /** 底层的 Lexical 编辑器，给高级用法用。 */
  getEditor: () => LexicalEditor
}

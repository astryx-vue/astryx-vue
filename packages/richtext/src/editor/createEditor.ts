import type { Transformer } from '@lexical/markdown'
import type { AnyLexicalExtensionArgument, EditorThemeClasses, Klass, LexicalEditor, LexicalNode } from 'lexical'
import { buildEditorFromExtensions, defineExtension, HorizontalRuleExtension, TabIndentationExtension } from '@lexical/extension'
import { HistoryExtension } from '@lexical/history'
import { LinkExtension } from '@lexical/link'
import { CheckListExtension } from '@lexical/list'
import { registerMarkdownShortcuts } from '@lexical/markdown'
import { RichTextExtension } from '@lexical/rich-text'
import { TableExtension } from '@lexical/table'
import { configExtension, mergeRegister } from 'lexical'
import { DEFAULT_NODES } from '../editorNodes.js'
import { DEFAULT_TRANSFORMERS } from '../markdownTable.js'
import { registerTableColumnFloor } from './plugins/tableColumnFloor.js'
import { registerTabFocusEscape } from './tabEscape.js'
import { TextSemanticsExtension } from './textSemantics.js'
import { sharedEditorTheme } from './theme.js'

export interface CreateRichTextEditorOptions {
  /** 编辑器的名字，用来区分同一页上的多个编辑器。 */
  namespace?: string
  /** 初始内容：序列化后的编辑器状态（JSON 字符串）。只在创建时读一次。 */
  initialState?: string
  /** 创建时是否可编辑。之后用 `editor.setEditable()` 改。 */
  editable?: boolean
  /** 在默认节点之外额外注册的节点。 */
  nodes?: ReadonlyArray<Klass<LexicalNode>>
  /** 是否开启 Markdown 快捷输入（`# ` 变标题、`- ` 变列表）。 */
  hasMarkdownShortcuts?: boolean
  /** 快捷输入用的转换器；传了就整个替换默认值。 */
  transformers?: ReadonlyArray<Transformer>
  /** 编辑器主题类名；不传就用包自带的。 */
  theme?: EditorThemeClasses
  /** 额外的 Lexical 扩展。 */
  extensions?: ReadonlyArray<AnyLexicalExtensionArgument>
}

/**
 * 建一个富文本编辑器。只用 Lexical 的「扩展」机制，不碰 Vue，服务端和测试里都能直接建。
 *
 * 行为和上游一致：标题、引用、列表、链接、代码、表格节点；撤销重做；Tab 缩进；
 * 勾选列表；分割线；Markdown 快捷输入；按过 Escape 之后 Tab 把焦点交还浏览器。
 */
export type RichTextEditorInstance = LexicalEditor & { dispose: () => void }

export function createRichTextEditor(options: CreateRichTextEditorOptions = {}): RichTextEditorInstance {
  const {
    namespace = 'astryx-editor',
    initialState,
    editable = true,
    nodes = [],
    hasMarkdownShortcuts = true,
    transformers = DEFAULT_TRANSFORMERS,
    theme = sharedEditorTheme(),
    extensions = [],
  } = options

  const root = defineExtension({
    name: '@astryx-vue/richtext/editor',
    namespace,
    theme,
    editable,
    nodes: [...DEFAULT_NODES, ...nodes],
    dependencies: [
      RichTextExtension,
      HistoryExtension,
      LinkExtension,
      CheckListExtension,
      configExtension(TabIndentationExtension, { disabled: false, maxIndent: null }),
      HorizontalRuleExtension,
      // GFM 表格没有合并单元格和单元格底色；Tab 留给缩进（按 Escape 再按 Tab 离开编辑器），方向键在格子间移动；
      // 太宽的表格在自己的容器里横向滚动。
      configExtension(TableExtension, { hasCellMerge: false, hasCellBackgroundColor: false, hasTabHandler: false, hasHorizontalScroll: true }),
      TextSemanticsExtension,
      ...extensions,
    ],
    // `undefined` 保留 Lexical 默认的初始化（空文档放一个空段落）；`null` 是真的空根，不是我们要的。
    $initialEditorState: initialState ?? undefined,
    register: editor => mergeRegister(
      registerTabFocusEscape(editor),
      registerTableColumnFloor(editor),
      hasMarkdownShortcuts ? registerMarkdownShortcuts(editor, [...transformers]) : () => {},
    ),
    onError(error: Error) {
      // 把错误交给使用方，不要吞掉。
      throw error
    },
  })
  return buildEditorFromExtensions(root)
}

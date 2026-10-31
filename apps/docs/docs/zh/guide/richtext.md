---
title: 富文本
---

<script setup lang="ts">
import { richtextAutoLink, richtextToolbar, richtextView } from '../../../components/richtext-demos'
</script>

# 富文本

::: warning
`lexical` 与 `@lexical/*` 是可选 peer 依赖，需自行安装，版本锁定在 `0.52.0`。
:::

## 使用方法

`@astryx-vue/richtext` 是基于 Lexical 的所见即所得富文本编辑器。

安装依赖与导入样式：

```bash
pnpm add @astryx-vue/richtext \
  lexical@0.52.0 @lexical/code@0.52.0 @lexical/extension@0.52.0 @lexical/headless@0.52.0 \
  @lexical/history@0.52.0 @lexical/html@0.52.0 @lexical/link@0.52.0 @lexical/list@0.52.0 \
  @lexical/markdown@0.52.0 @lexical/rich-text@0.52.0 @lexical/selection@0.52.0 \
  @lexical/table@0.52.0 @lexical/utils@0.52.0
```

```ts
import '@astryx-vue/richtext/richtext.css'
```

最简用法（`label` 为必填项）：

```vue
<RichTextEditor label="发布内容" placeholder="请输入正文..." />
```

<DemoExample :demo="richtextToolbar" description="带顶部格式工具栏的富文本编辑器。" locale="zh" title="完整编辑器" />

## 使用建议

- **Lexical 类型**：`nodes`、`transformers` 接收的是 Lexical 的类型，`@change` 给出的也是 Lexical 的 `EditorState`，所以用到它们的地方需要自己装好 Lexical。
- **状态保存**：监听 `@change` 获取 `editorState.toJSON()` 存入后端；通过 `defaultValue` 或 `<RichTextView :value="...">` 读回。
- **自定义节点**：在 `<RichTextEditor>` 和 `<RichTextView>` 两边都通过 `nodes` 注册自定义节点，保证数据往返一致。
- **模板引用方法**：通过 ref 可调用 `focus()`、`clear()`、`getEditorState()`、`getMarkdown()`、`getHTML()`、`getEditor()`。只读或禁用时 `focus`/`clear` 为空操作；`getMarkdown()` 保持未改动块的原样，仅规范输出修改过的块。
- **GFM 表格**：默认支持导入、编辑与导出，太宽的表格在自己的容器里横向滚动；依赖 `@lexical/table`。<kbd>Tab</kbd> 在编辑器里用来缩进，要离开编辑器，先按 <kbd>Escape</kbd> 再按 <kbd>Tab</kbd>。
- **分割线**：`---`、`***`、`___` 导入为水平线，导出为 `---`；点一下选中，按退格删除；依赖 `@lexical/extension`。
- **服务端转换**：从 `@astryx-vue/richtext/markdown` 引入 `markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`，无 DOM 依赖且保持 Markdown 无损往返。
- **Markdown 插件扩展**：用 `createRichTextExtension(plugin)` 接入并在客户端传给 `markdownExtensions`；插件语法作为整体节点渲染、编辑与导出，重复接入会抛出 `RichTextExtensionError`。
- **工具栏**：通过 `#toolbar` 插槽传入 `<RichTextEditorToolbar />`，它顶到编辑区两边，包含撤销重做、块格式、行内样式和链接按钮；空间不够时这一行横向滚动；可用 `#end` 插槽追加控件。
- **链接与快捷键**：工具栏链接按钮与 <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> 打开对话框；自动过滤非安全协议；默认在新标签页打开（可通过 `hasNewTabLinks` 控制），也支持 `promptForUrl`。
- **自动链接**：把 `<RichTextEditorAutoLinkPlugin>` 放入默认插槽，输入网址或邮箱时自动变为链接，支持 `matchers` 自定义规则。
- **图标定制**：工具栏图标使用 `richtext:*` 键名（如 `richtext:bold`），可在主题配置中自定义替换，无需重写工具栏。
- **只读展示与场景选择**：纯展示持久化内容使用 `<RichTextView>`，是语义化文档内容而非表单输入框；单行或纯文本输入请使用 TextInput 或 TextArea。

<DemoExample :demo="richtextAutoLink" description="输入网址自动转为超链接。" locale="zh" title="自动链接" />
<DemoExample :demo="richtextView" description="只读渲染保存后的富文本状态。" locale="zh" title="只读视图" />

## `<RichTextEditor>` 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `label` | `string` | 必填 | 编辑器标签文字，供无障碍读屏使用。 |
| `isLabelHidden` | `boolean` | `false` | 视觉上隐藏标签，读屏软件仍可读取。 |
| `description` | `string` | - | 标签与编辑区之间的说明文字。 |
| `isOptional` | `boolean` | `false` | 标记为选填（与 `isRequired` 互斥）。 |
| `isRequired` | `boolean` | `false` | 标记为必填（与 `isOptional` 互斥）。 |
| `defaultValue` | `string` | - | 初始内容 JSON 字符串，仅在挂载时读取一次。 |
| `placeholder` | `string` | - | 内容为空时的提示文字。 |
| `isReadOnly` | `boolean` | `false` | 是否只读。不可编辑但文字清晰，仍可通过 Tab 键聚焦。 |
| `isDisabled` | `boolean` | `false` | 是否禁用。不可编辑、颜色变淡并移出 Tab 顺序；与 `isReadOnly` 均设为 true 时以禁用为准。 |
| `status` | `RichTextEditorStatus` | - | 校验状态 `{ type, message? }`，决定边框颜色并在下方提示。 |
| `statusVariant` | `'attached' \| 'detached' \| 'tooltip'` | `'attached'` | 状态提示的呈现位置。 |
| `width` | `number \| string` | - | 字段宽度，数字为像素，字符串为 CSS 长度。 |
| `minHeight` | `number \| string` | `'4.5rem'` | 编辑区最小高度，内容超出自动增高。 |
| `labelTooltip` | `string` | - | 标签右侧提示图标中的文字。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 编辑器尺寸，影响内部内边距。 |
| `nodes` | `ReadonlyArray<Klass<LexicalNode>>` | - | 额外注册的 Lexical 节点类型。 |
| `extensions` | `ReadonlyArray<AnyLexicalExtensionArgument>` | - | 额外的 Lexical 扩展插件数组。 |
| `markdownExtensions` | `ReadonlyArray<RichTextMarkdownExtension>` | - | 要识别的 Markdown 插件扩展数组。 |
| `hasMarkdownShortcuts` | `boolean` | `true` | 是否开启 Markdown 快捷输入（如 `# ` 变标题）。 |
| `transformers` | `ReadonlyArray<Transformer>` | 默认转换器 | 自定义 Markdown 转换规则。 |
| `hasAutoFocus` | `boolean` | `false` | 挂载后是否自动聚焦编辑区。 |
| `tabEscapeHint` | `string` | 本地化文案 | 读屏提示：按 Escape 再按 Tab 移出焦点；传 `""` 可隐藏。 |
| `maxLength` | `number` | - | 纯文字字数上限，超出后计数显示错误样式。 |
| `namespace` | `string` | `'astryx-editor'` | 底层 Lexical 实例命名空间。 |

- **事件**：`@change="(editorState, editor) => void"` 在内容改变时触发，用于保存状态。
- **插槽**：`#toolbar` 顶部工具栏插槽；`#default` 内部插件插槽（如放置 `<RichTextEditorAutoLinkPlugin>`）。
- **模板引用方法**：`focus()` 聚焦；`clear()` 清空；`getEditorState()` 获取状态；`getMarkdown()` 导出 Markdown；`getHTML()` 导出 HTML；`getEditor()` 获取底层 Lexical 实例。

### `<RichTextEditorToolbar>` 属性与插槽

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `label` | `string` | 本地化文案 | 工具栏无障碍名称。 |
| `headingLevels` | `ReadonlyArray<'h1' \| 'h2' \| 'h3'>` | `['h1', 'h2', 'h3']` | 块格式下拉中包含的标题级别。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | 工具栏尺寸。 |
| `hasLink` | `boolean` | `true` | 是否显示链接按钮及启用 Cmd/Ctrl+K 快捷键。 |
| `promptForUrl` | `(selectedText: string) => string \| null \| undefined` | - | 自定义获取网址的回调函数。 |
| `hasNewTabLinks` | `boolean` | `true` | 插入的链接是否在新标签页打开。 |

- **插槽**：`#end` 尾部自定义插槽，渲染在默认按钮右侧。

### `<RichTextView>` 属性、事件与插槽

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `value` | `string` | 必填 | 要渲染的编辑器状态 JSON 字符串。 |
| `nodes` | `ReadonlyArray<Klass<LexicalNode>>` | - | 额外注册的 Lexical 节点，需与写入时一致。 |
| `markdownExtensions` | `ReadonlyArray<RichTextMarkdownExtension>` | - | 要识别的 Markdown 插件扩展数组。 |
| `namespace` | `string` | `'astryx-view'` | 底层 Lexical 实例命名空间。 |

- **事件**：`@parseError="(error: Error) => void"` 在内容解析失败时触发。
- **插槽**：`#errorFallback` 解析失败时的降级显示内容；`#default` 内部扩展插槽。

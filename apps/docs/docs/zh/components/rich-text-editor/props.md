---
layout: component-docs
title: 富文本编辑器
outline: false
footer: false
---

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

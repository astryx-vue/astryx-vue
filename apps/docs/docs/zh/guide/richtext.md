---
title: 富文本
---

<script setup lang="ts">
import {
  richtextAutoLink,
  richtextBasic,
  richtextReadOnly,
  richtextState,
  richtextStatus,
  richtextToolbar,
  richtextView,
} from '../../../components/richtext-demos'
</script>

# 富文本

::: warning 需要自行安装依赖
`@astryx-vue/richtext` 把 `lexical` 及其相关包设为了可选 peer 依赖（peerDependencies）。为了让编辑器正常工作，请在你的项目里自己安装 `lexical` 与 `@lexical/*` 系列包，版本和本包锁在同一个次版本：`0.52.0`。
:::

## 这是什么

`@astryx-vue/richtext` 是一个给 Vue 3 用的富文本编辑器组件包。底层基于 Lexical 框架，让用户在网页里直接输入标题、加粗文字、列表、代码块和表格，所见即所得。

它主要帮你做三件事：
1. 提供开箱即用的富文本编辑框 `<RichTextEditor>` 与顶部格式工具栏 `<RichTextEditorToolbar>`。
2. 支持输入 `# ` 或 `- ` 自动生成标题与列表（Markdown 快捷输入），并能原样把内容导出成 Markdown。
3. 提供纯展示的只读视图 `<RichTextView>`，用轻量的方式把存下来的文档内容画出来。

## 安装

富文本编辑器依赖同级的 `@astryx-vue/core`、`vue` 以及 Meta 的 `lexical` 系列包。请在项目终端里执行安装命令（注意：所有 `@lexical/*` 和 `lexical` 的版本必须保持在 `0.52.0`）：

```bash
pnpm add @astryx-vue/richtext \
  lexical@0.52.0 \
  @lexical/code@0.52.0 \
  @lexical/extension@0.52.0 \
  @lexical/headless@0.52.0 \
  @lexical/history@0.52.0 \
  @lexical/html@0.52.0 \
  @lexical/link@0.52.0 \
  @lexical/list@0.52.0 \
  @lexical/markdown@0.52.0 \
  @lexical/rich-text@0.52.0 \
  @lexical/selection@0.52.0 \
  @lexical/table@0.52.0 \
  @lexical/utils@0.52.0
```

接着在你的应用入口文件（如 `main.ts`）里引入编辑器的基础样式：

```ts
import '@astryx-vue/richtext/richtext.css'
```

## 第一段内容

使用 `<RichTextEditor>` 最少只要传一个 `label` 属性。`label` 是给读屏软件识别这个输入框用途的名字，为了无障碍体验，它是必填项。

这是一段最短的可运行代码：

```vue
<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="发布说明" placeholder="请在这里输入内容..." />
</template>
```

实际运行效果如下：

<DemoExample
  :demo="richtextBasic"
  description="基础的富文本编辑器，带有标签、占位文字与初始段落内容。"
  locale="zh"
  title="基础编辑器"
/>

## `<RichTextEditor>` 的属性

本节列出 `<RichTextEditor>` 支持的所有属性、插槽、事件以及模板引用暴露的方法。

### 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `label` | `string` | 必填 | 编辑器的标签文字。无障碍读屏软件需要用到它，因此必须填写。 |
| `isLabelHidden` | `boolean` | `false` | 是否只对读屏软件朗读标签，视觉上把标签隐藏起来。 |
| `description` | `string` | - | 摆在标签和编辑区之间的详细说明文字。 |
| `isOptional` | `boolean` | `false` | 是否标记为选填。和 `isRequired` 互斥。 |
| `isRequired` | `boolean` | `false` | 是否标记为必填。和 `isOptional` 互斥。 |
| `defaultValue` | `string` | - | 初始内容字符串（由 `JSON.stringify(editorState.toJSON())` 得到）。编辑器是非受控的，只在创建挂载时读取一次。 |
| `placeholder` | `string` | - | 编辑区完全为空时显示的提示灰字。 |
| `isReadOnly` | `boolean` | `false` | 是否只读。文字保持原有清晰度，键盘 Tab 键依然能跳进来，方便复制或读屏，但不能改动文字。 |
| `isDisabled` | `boolean` | `false` | 是否禁用。不可编辑、颜色变淡，且会从键盘 Tab 顺序中移除。若与 `isReadOnly` 同时为 true，以禁用为准。 |
| `status` | `RichTextEditorStatus` | - | 校验状态对象 `{ type: 'warning' \| 'error' \| 'success', message?: string }`。决定边框颜色并在下方显示提示信息。 |
| `statusVariant` | `'attached' \| 'detached' \| 'tooltip'` | `'attached'` | 状态提示信息的摆放位置。 |
| `width` | `number \| string` | - | 整个表单字段的宽度。传入数字当像素（px），传入字符串原样作为 CSS 长度。 |
| `minHeight` | `number \| string` | `'4.5rem'` | 编辑区域的最小高度。传入数字当像素，传入字符串作为 CSS 长度。 |
| `labelTooltip` | `string` | - | 标签右侧信息小图标悬浮时出现的提示文本。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 编辑器尺寸，影响编辑框的内部留白（内边距）。 |
| `nodes` | `ReadonlyArray<Klass<LexicalNode>>` | - | 在默认节点（标题、引用、列表、链接、代码块、表格）之外额外注册的 Lexical 节点类型。 |
| `extensions` | `ReadonlyArray<AnyLexicalExtensionArgument>` | - | 额外的 Lexical 扩展插件数组。 |
| `markdownExtensions` | `ReadonlyArray<RichTextMarkdownExtension>` | - | 要识别的 Markdown 插件扩展数组，由 `createRichTextExtension` 生成。 |
| `hasMarkdownShortcuts` | `boolean` | `true` | 是否开启 Markdown 快捷输入（例如行首打 `# ` 变大标题，打 `- ` 变无序列表）。 |
| `transformers` | `ReadonlyArray<Transformer>` | 默认转换器 | 自定义 Markdown 转换规则。如果不传，默认使用标准转换器加 GFM 表格。 |
| `hasAutoFocus` | `boolean` | `false` | 组件挂载完成后是否自动把输入光标聚焦到编辑区。 |
| `tabEscapeHint` | `string` | 默认文案 | 给读屏软件朗读的退出编辑提示。因为 Tab 键在编辑器里用来缩进文字，离开编辑器需要先按 Escape 再按 Tab。传空字符串表示不输出这段提示。 |
| `maxLength` | `number` | - | 纯文字字数上限。设置后会在右下角显示计数；超出后不会截断文字，但计数器会变红提醒。 |
| `namespace` | `string` | `'astryx-editor'` | 底层 Lexical 实例的命名空间，同一页面有多个编辑器时用来互相区分。 |

### 插槽

- `#toolbar`：放在编辑区正上方、顶到两边的工具栏插槽。通常在这里放 `<RichTextEditorToolbar />`。
- `#default`：编辑区内部的插槽。可以放无界面的扩展组件（例如调用 `useLexicalEditor()` 的自动链接插件或自定义功能组件）。

### 事件

- `@change`：当用户修改了编辑内容时触发。提供两个参数：
  - `editorState: EditorState`：最新的编辑器状态对象，可以用 `editorState.toJSON()` 转成 JSON 存进数据库。
  - `editor: LexicalEditor`：底层的 Lexical 编辑器实例。

### 模板引用暴露的方法

给 `<RichTextEditor>` 绑定 `ref` 后，可以调用以下实例方法：

```ts
const editorRef = ref<RichTextEditorExposed>()

// 聚焦到编辑区
editorRef.value?.focus()

// 清空所有内容，恢复成一个空段落
editorRef.value?.clear()

// 读取当前的编辑器状态对象
const state = editorRef.value?.getEditorState()

// 把当前内容导出为 Markdown 字符串（原本未修改的块保持原样）
const markdown = editorRef.value?.getMarkdown()

// 把当前内容导出为 HTML 字符串（依赖浏览器 DOM 环境）
const html = editorRef.value?.getHTML()

// 获取底层的 LexicalEditor 实例，供深度定制使用
const rawEditor = editorRef.value?.getEditor()
```

下面的例子展示了监听 `@change` 事件以及调用 `clear()` 和 `getMarkdown()` 的用法：

<DemoExample
  :demo="richtextState"
  description="监听 change 事件实时获取状态变更次数与导出的 Markdown，并支持点击按钮一键清空。"
  locale="zh"
  title="状态监听与导出"
/>

## 只读与禁用

编辑器提供了 `isReadOnly`（只读）和 `isDisabled`（禁用）两种不可编辑状态。它们在交互和无障碍上有明确的分工：

1. **只读（`isReadOnly`）**：
   - 内容文字颜色不淡化，保持清晰可读。
   - 依然保留在键盘 Tab 键的切焦顺序中，视障用户通过键盘切过来时，读屏软件会明确朗读它是「只读」文本。
   - 用户可以选中里面的文字进行复制。
2. **禁用（`isDisabled`）**：
   - 整个输入框与文字都会变淡变灰。
   - 彻底从键盘 Tab 键顺序中移出，按 Tab 键会直接跳过它。
   - 读屏软件会明确朗读它是「禁用」。
   - 如果同一个组件上同时写了 `isReadOnly` 和 `isDisabled`，**以禁用为准**。

```vue
<!-- 只读模式：方便查看和复制，且支持键盘聚焦与读屏 -->
<RichTextEditor label="发布说明" :default-value="savedContent" is-read-only />

<!-- 禁用模式：灰显且不在键盘切换顺序中 -->
<RichTextEditor label="发布说明" :default-value="savedContent" is-disabled />
```

<DemoExample
  :demo="richtextReadOnly"
  description="设置为 is-read-only 的表单字段，不可编辑但依然可聚焦、可复制。"
  locale="zh"
  title="只读字段"
/>

注意区分带标签的只读字段与纯展示视图：
- **`<RichTextEditor is-read-only>`**：适用于**表单场景**。它带有字段标签（Label）、辅助说明与边框外框，语义上依然是一个表单输入框（只读控件）。
- **`<RichTextView>`**：适用于**正文展示场景**（比如文章详情页、博客正文）。它没有外层表单框，剥离了所有表单语义，只是纯粹渲染文档内容。

校验状态属性 `status` 与字数上限 `maxLength` 的展示效果如下：

<DemoExample
  :demo="richtextStatus"
  description="带有错误状态提示红框，并限制最大字数的输入效果。"
  locale="zh"
  title="校验状态与字数上限"
/>

## 工具栏

`<RichTextEditorToolbar>` 是配合编辑器使用的格式控制栏。把它放在 `<RichTextEditor>` 的 `#toolbar` 插槽里，就会贴合固定在编辑区顶部。

```vue
<script setup lang="ts">
import { RichTextEditor, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="工作周报">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
  </RichTextEditor>
</template>
```

<DemoExample
  :demo="richtextToolbar"
  description="在 toolbar 插槽中放置格式工具栏，支持撤销、重做、标题切换、字形样式与添加超链接。"
  locale="zh"
  title="带格式工具栏"
/>

### 工具栏功能与快捷键

工具栏内置了常用的排版能力：
- **历史记录**：撤销（Undo）与重做（Redo）。
- **块级格式**：段落正文、一级标题（H1）、二级标题（H2）、三级标题（H3）、引用块（Quote）、无序圆点列表（Bullet List）、有序数字列表（Numbered List）。
- **行内样式**：加粗（Bold）、斜体（Italic）、下划线（Underline）、删除线（Strikethrough）、行内代码（Code）。
- **插入与编辑链接**：点击工具栏的链接图标，或者在选中文本后按下快捷键 <kbd>Cmd</kbd> + <kbd>K</kbd>（Windows 上为 <kbd>Ctrl</kbd> + <kbd>K</kbd>），会弹出内置的链接浮层。
  - 在弹出的浮层里输入地址并回车即可插入链接。浮层打开时选区依然保留，不会导致光标跑丢。
  - 所有输入的链接地址都会经过内置的 `sanitizeUrl` 校验清洗，系统只放行 `http:`、`https:`、`mailto:` 和 `tel:` 开头的安全协议，阻断 `javascript:` 等恶意脚本。

### `<RichTextEditorToolbar>` 的属性与插槽

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `label` | `string` | 本地化文案 | 工具栏整体的无障碍名称（默认为「文字格式」）。 |
| `headingLevels` | `ReadonlyArray<'h1' \| 'h2' \| 'h3'>` | `['h1', 'h2', 'h3']` | 在「块格式」下拉菜单里显示哪几级标题，按数组顺序排列。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | 工具栏尺寸，同步缩放里面所有按钮和下拉选择框。 |
| `hasLink` | `boolean` | `true` | 是否显示链接按钮，以及是否开启 <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> 快捷键。 |
| `hasNewTabLinks` | `boolean` | `true` | 插入的链接是否默认在新标签页打开（新标签页会自带 `target="_blank"` 与 `rel="noopener noreferrer"`）。 |
| `promptForUrl` | `(selectedText: string) => string \| null \| undefined` | - | 自定义输入网址的回调。如果不想使用内置链接弹窗，可以传入此函数自行弹窗获取网址。 |

插槽：
- `#end`：尾部自定义插槽。内容会渲染在所有默认按钮右侧（中间以一条竖分割线隔开），方便放入你自己的业务按钮，例如 @提及人、AI 帮写或表情选择器。

### 自定义图标

工具栏内置了一套简洁的 SVG 图标。如果你想换成项目自己的图标库（例如 Lucide 或 Carbon），可以通过全局主题配置 `defineTheme` 替换，每个图标键都带有 `richtext:` 前缀：

```ts
import { defineTheme } from '@astryx-vue/core'

defineTheme({
  icons: {
    'richtext:bold': 'lucide:bold',
    'richtext:italic': 'lucide:italic',
    'richtext:link': 'lucide:link',
    // 支持替换的键见下表
  },
})
```

`RICHTEXT_ICON_KEYS` 导出了所有支持替换的图标键：
- `bold`（加粗） -> `'richtext:bold'`
- `italic`（斜体） -> `'richtext:italic'`
- `underline`（下划线） -> `'richtext:underline'`
- `strikethrough`（删除线） -> `'richtext:strikethrough'`
- `code`（行内代码） -> `'richtext:code'`
- `link`（超链接） -> `'richtext:link'`
- `paragraph`（正文段落） -> `'richtext:paragraph'`
- `h1`、`h2`、`h3`（标题） -> `'richtext:h1'`、`'richtext:h2'`、`'richtext:h3'`
- `quote`（引用） -> `'richtext:quote'`
- `bullet`（无序列表） -> `'richtext:bullet'`
- `number`（有序列表） -> `'richtext:number'`
- `undo`（撤销） -> `'richtext:undo'`
- `redo`（重做） -> `'richtext:redo'`

## 插件

插件能为编辑器扩展新玩法，例如检测任务勾选、代码块高亮或者网址自动变超链接。

### 默认已开启的功能插件

当你使用 `<RichTextEditor>` 时，编辑器内部已经默认集成了以下几项能力，不需要你额外配置：
- **任务勾选框（Task Checkbox）**：支持 `- [ ]` 和 `- [x]` 任务清单语法，生成的勾选框可以直接点击勾选或取消，在只读模式下会自动锁定不可点。
- **代码块标题栏与复制按钮（CodeBlockHeaderPlugin）**：遇到代码块时，顶部会展示语言名称（如 `TypeScript`、`Python`）并附带一键复制代码的按钮。
- **代码语法高亮（CodeSyntaxPlugin）**：对代码块里的关键字、字符串、数字等按语法上色，颜色和 `CodeBlock` 用同一套语法色变量。
- **表格列宽自适应与横向滚动（Table Plugins）**：表格列设定了最小宽度保护，并在超宽时提供无障碍横向滚动支持。

### 自动链接插件：`RichTextEditorAutoLinkPlugin`

输入或粘贴一段网址时，自动把它转成可点击的超链接是一项常见需求。为了保证轻量，这项能力做成了无界面的 Vue 组件插件。使用时直接放在 `<RichTextEditor>` 的默认插槽里：

```vue
<script setup lang="ts">
import { RichTextEditor, RichTextEditorAutoLinkPlugin, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="便签" placeholder="粘贴网址试试看...">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
    <!-- 放入自动链接插件 -->
    <RichTextEditorAutoLinkPlugin />
  </RichTextEditor>
</template>
```

<DemoExample
  :demo="richtextAutoLink"
  description="放入 RichTextEditorAutoLinkPlugin 后，输入 http 网址或邮箱会自动转为可点击的超链接。"
  locale="zh"
  title="自动生成链接"
/>

插件默认自带了网址和电子邮箱两个匹配器（`DEFAULT_LINK_MATCHERS`）。识别出的网址如果没写协议会自动补齐 `https://`，邮箱会自动加上 `mailto:`，并且生成的链接都会加上 `target="_blank"` 和 `rel="noopener noreferrer"` 以便安全地在新窗口打开。

如果你想识别自定义语法（例如把 `#123` 自动变成工单链接），可以通过 `matchers` 属性传入自定义的匹配规则：

```vue
<RichTextEditorAutoLinkPlugin :matchers="myCustomMatchers" @change="(url, prevUrl) => onLinkChange(url, prevUrl)" />
```

自动加上、改掉或去掉链接时，插件会发出 `change` 事件，参数是新网址（去掉时是 `null`）和原来的网址。`myCustomMatchers` 用 `@lexical/link` 的 `createLinkMatcherWithRegExp` 来建。

## Markdown 进出

大部分时候，我们在前端编辑富文本，后端想存的却是通用的 Markdown 纯文本。`@astryx-vue/richtext` 提供了「无损往返」的转换机制。

### 纯函数转换

你可以从 `@astryx-vue/richtext/markdown` 导出两个转换函数。这个入口不依赖浏览器 DOM，在 Node.js、Cloudflare Workers 等服务端渲染（SSR）环境里都可以安全调用：

```ts
import { editorStateJSONToMarkdown, markdownToEditorStateJSON } from '@astryx-vue/richtext/markdown'

// 1. 服务端或初始化时：把 Markdown 字符串转成给 defaultValue 用的 JSON 字符串
const defaultValue = markdownToEditorStateJSON('# 欢迎\n\n这是一段 **Markdown** 文本。')

// 2. 保存或提交时：把编辑器导出的 JSON 字符串还原回 Markdown 文本
const markdown = editorStateJSONToMarkdown(savedJson)
```

### 原样往返设计

传统的富文本转换器在「Markdown -> 编辑器 -> 重新导出 Markdown」这个过程中，经常会打乱排版，比如把使用者的缩进弄丢、把 `*` 号全改成 `-` 号。

Astryx 富文本采用了一套源码保留机制：对于导入进来的 Markdown 文本，只要用户在编辑时没有改动这个段落，导出时就会**原封不动保持用户最初写下的每一个标点和空格**；只有被改动过或全新写出的段落，才会使用规范的语法格式化输出。

## Markdown 插件节点

有些时候，项目里会有一些定制的 Markdown 语法，比如用 `@用户名` 提及同事、用特定指令插入告警框等。

你可以使用 `createRichTextExtension` 函数把自定义的 Markdown 语法插件接入进来：

```ts
import { createRichTextExtension } from '@astryx-vue/richtext'
import { mentionPlugin } from './myMentionPlugin'

// 包装成编辑器能识别的扩展
const mentionsExtension = createRichTextExtension(mentionPlugin)
```

然后在 `<RichTextEditor>` 或 `<RichTextView>` 上通过 `markdownExtensions` 属性传给它们：

```vue
<RichTextEditor
  label="讨论区"
  :markdown-extensions="[mentionsExtension]"
/>
```

在转换函数中也可以传入：

```ts
const json = markdownToEditorStateJSON(markdownText, {
  extensions: [mentionsExtension],
})
```

::: warning 插件冲突检查
为了保证数据一致性，如果同一个语法插件被重复注册了两次，或者两个插件声明了相互冲突的语法规则，系统会直接抛出 `RichTextExtensionError` 错误并终止运行。
:::

## 只读视图 RichTextView

当你只需要在页面上展示文章、博客或发版公告，而不需要任何输入编辑功能时，应该使用 `<RichTextView>` 组件。

```vue
<script setup lang="ts">
import { RichTextView } from '@astryx-vue/richtext'

// 这里的 value 是先前通过 editorState.toJSON() 存下的 JSON 字符串
const content = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"这是展示内容","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
</script>

<template>
  <RichTextView :value="content" />
</template>
```

<DemoExample
  :demo="richtextView"
  description="RichTextView 仅用于渲染持久化的富文本内容，不带表单框和输入光标。"
  locale="zh"
  title="只读展示视图"
/>

### 设计定位与无障碍考虑

- **是文档内容，不是表单控件**：底层 Lexical 即使在不可编辑状态下，默认也会给根节点套上 `role="textbox"`。但如果展示一整篇几千字的文章却被标记为「文本输入框」，视障用户的读屏软件就无法正确按文章阅读，无障碍检测工具也会报错。`<RichTextView>` 会在挂载时主动去除所有表单输入框语义，把它还原为一个纯粹的文档容器。
- **就地热更新**：当父组件更新了 `value` 属性时，内部会就地切换解析状态，不会频繁销毁和重新挂载整个 DOM 结构。
- **错误容灾机制**：从后端读出的历史 JSON 如果因为版本升级或格式损坏导致无法解析，组件不会让整个页面崩溃白屏。它会触发 `@parseError` 事件，并且可以通过 `#errorFallback` 插槽展示友好的降级提示界面：

```vue
<RichTextView :value="maybeCorruptedContent" @parse-error="onParseError">
  <template #errorFallback>
    <div class="error-box">抱歉，文档内容加载失败。</div>
  </template>
</RichTextView>
```

## 键盘操作

编辑器针对键盘使用者进行了深度优化：

- **Tab 缩进与退出**：
  - 在正文段落或列表里按下 <kbd>Tab</kbd> 键，会增加当前行的文字缩进；按下 <kbd>Shift</kbd> + <kbd>Tab</kbd> 会减少缩进。
  - 由于 <kbd>Tab</kbd> 键被用来做文本排版，视障或全键盘用户需要能够把焦点移出编辑器。编辑器遵循无障碍规范：**先按一次 <kbd>Escape</kbd> 键，再按 <kbd>Tab</kbd> 键**，焦点就会跳出编辑器，移动到网页的下一个可交互元素上。
  - 编辑器默认会向读屏软件朗读这段退出指引。如果你想自定义朗读文本，可以修改 `tabEscapeHint` 属性；传空字符串 `tabEscapeHint=""` 则可以关闭该朗读。
- **表格中的键盘移动**：
  - 在表格单元格中输入时，按下方向键（<kbd>↑</kbd>、<kbd>↓</kbd>、<kbd>←</kbd>、<kbd>→</kbd>）可以在相邻单元格之间平滑穿梭移动。
- **快捷键**：
  - <kbd>Cmd</kbd> + <kbd>K</kbd>（macOS）或 <kbd>Ctrl</kbd> + <kbd>K</kbd>（Windows）：快速打开超链接设置弹窗。
  - <kbd>Cmd/Ctrl</kbd> + <kbd>B</kbd>：粗体。
  - <kbd>Cmd/Ctrl</kbd> + <kbd>I</kbd>：斜体。
  - <kbd>Cmd/Ctrl</kbd> + <kbd>Z</kbd>：撤销；<kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>：重做。
  - 下划线没有键盘快捷键，用工具栏上的按钮。

## 无障碍

Astryx 富文本编辑器在无障碍体验（a11y）上做了大量细节处理：

1. **清晰的 Label 关联**：通过必填的 `label` 属性，外层自动建立无障碍名称映射。即便设置了 `isLabelHidden`，该名称依然会通过 `aria-label` 忠实传达给读屏软件。
2. **区分只读与禁用**：`isReadOnly` 会挂载 `aria-readonly="true"` 并保持 `tabindex="0"`，读屏朗读为只读文本；`isDisabled` 会挂载 `aria-disabled="true"` 并彻底移除 Tab 聚焦顺序。
3. **字数与表单状态联动**：当配置了 `maxLength` 时，实时的纯文本字数会在接近上限（超过 80%）及超额时，通过 `aria-live="polite"` 的隐藏广播区向读屏用户报读剩余或超出的字数；错误状态时会自动设置 `aria-invalid="true"`。
4. **焦点与选区保护**：工具栏中的弹窗（如添加链接）在开启时，不会销毁编辑区原有的文本选区；关闭弹窗后焦点能够平滑归还。

## 现在不支持的

为了保持 Vue 实现的纯粹性与稳定性，本包与上游 React 原版实现存在以下差异：

1. **不支持 `xstyle` 样式方案**：上游 React 版本依赖内部的 `xstyle` 样式对象机制，在 Vue 移植版中不予支持。请统一使用标准的 Vue `class` 和 `style` 属性来定义外观。
2. **插件机制为 Vue 组件插槽**：上游的 `plugins` 是作为 React 节点数组传递的；而在 `@astryx-vue/richtext` 中，扩展插件是纯逻辑的无界面 Vue 组件（例如 `<RichTextEditorAutoLinkPlugin />`），直接写在 `<RichTextEditor>` 的默认插槽内部即可。

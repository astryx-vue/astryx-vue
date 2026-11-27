---
layout: component-docs
title: 富文本编辑器
outline: false
footer: false
---

<script setup lang="ts">
import { richtextAutoLink, richtextToolbar, richtextView } from '../../../../components/demos/rich-text-editor'
</script>

## 安装

::: code-group
```sh [pnpm]
pnpm add @astryx-vue/richtext
```

```sh [npm]
npm install @astryx-vue/richtext
```

```sh [yarn]
yarn add @astryx-vue/richtext
```

```sh [bun]
bun add @astryx-vue/richtext
```
:::

`RichTextEditor` 基于 Lexical。你还需要根据所用功能自行安装 `lexical` 和相应的 `@lexical/*` 子包，版本统一为 `0.52.0`。

## 创建编辑器

在应用入口引入一次样式，然后渲染 `RichTextEditor`。`label` 是必填属性，用于标识编辑器的无障碍名称。

```vue
<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
import '@astryx-vue/richtext/richtext.css'
</script>

<template>
  <RichTextEditor label="发布内容" placeholder="请输入正文..." />
</template>
```

通过 `#toolbar` 插槽加入 `RichTextEditorToolbar`，即可获得撤销、块格式、行内样式和链接操作。工具栏空间不足时会横向滚动。

<DemoExample :demo="richtextToolbar" description="使用 #toolbar 插槽添加格式工具栏。" locale="zh" title="带工具栏的编辑器" />

## 保存并展示内容

编辑器和只读视图使用同一份 Lexical 状态 JSON：

1. 监听编辑器的 `@change`，将 `editorState.toJSON()` 保存到后端。
2. 再次编辑时，把保存的 JSON 字符串传给 `defaultValue`。该属性只在挂载时读取。
3. 只读展示时，把同一个字符串传给 `RichTextView` 的 `value`，不要再渲染一个只读编辑器。

如果通过 `nodes` 注册自定义节点，编辑器和只读视图必须注册同一组节点，否则内容无法完整往返。

<DemoExample :demo="richtextView" description="将保存的 Lexical 状态 JSON 交给 RichTextView 进行只读渲染。" locale="zh" title="只读展示已保存的内容" />

## 文字方向

编辑器和 `RichTextView` 里的每个段落、标题、引用和列表项都按自己文字的方向排版（取第一个有明确方向的字符），所以英文文档里的希伯来文或阿拉伯文块从右往左读，反过来也一样。只有数字、标点、图片或空段落这类没有明确方向字符的块，沿用文档的方向。方向会在编辑的同一次更新里写到块上，随内容一起保存。列表、表格和代码块沿用外面的方向，代码块里的每一行各按自己的方向读。

## 键盘操作

| 操作 | 按键 |
| --- | --- |
| 在代码块中换行 | <kbd>Enter</kbd> |
| 在表格单元格之间移动 | 方向键 |
| 在代码块或表格末尾创建并进入下方段落 | <kbd>ArrowDown</kbd> |
| 打开或关闭链接对话框 | <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> |
| 缩进或反缩进代码块里选区碰到的每一行 | <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> |
| 把代码块变回段落 | 光标在代码块开头按 <kbd>Backspace</kbd> |
| 先选中代码或单元格文字，再选中整篇文档 | 在代码块或表格单元格里按 <kbd>Cmd/Ctrl</kbd> + <kbd>A</kbd> |
| 离开整个编辑器 | 先按 <kbd>Escape</kbd>，再按 <kbd>Tab</kbd>；反向移动使用 <kbd>Shift</kbd> + <kbd>Tab</kbd> |

光标位于代码块或表格末尾时，<kbd>ArrowDown</kbd> 会在下方没有内容，或者下方紧邻另一个代码块或表格时插入段落。这样可以在这两类块之间补充正文；下方已经是普通内容时，方向键沿用 Lexical 的原生导航。

## 粘贴、快捷输入与禁用时的链接

- 往代码块里粘贴富文本时只插入纯文本，每个块一行，代码里不会混进加粗、链接或表格。
- 往表格单元格里粘贴表格时，从选区左上角的单元格开始逐格写入，并补足需要的行和列。网页复制出的「段落加表格」这类混合内容，里面的表格按文字放进单元格，因为单元格里放不下表格。
- 在列表项开头输入 Markdown 标记（`## `、`> `、`- `、`1. `、`[ ] `），这一项会改成对应的标题、引用、无序、有序或任务项，每次改动是一个撤销步。它跟随 `hasMarkdownShortcuts`。
- 编辑器被禁用时，里面的链接不进入 Tab 顺序，也不会跳转。
- Markdown 里的图片（`![alt](url)` 或引用图片）作为一整块源码文字进来：整块删除，光标进不去，自动链接也不碰它的网址。在它旁边或周围编辑，导出时源码原样写回，别的读者看到的仍然是图片。
- 没写协议、带端口的地址（如 `localhost:3000`、`example.com:8080`）会按 `https://` 生成链接。
- 没选中文字时点「插入链接」，会把输入的地址作为链接文字插在光标处；光标在链接里则更新这条链接。

## 自动链接与服务端转换

将 `RichTextEditorAutoLinkPlugin` 放入编辑器默认插槽，可以把输入的网址和邮箱自动转换为链接；通过 `matchers` 可以扩展匹配规则。代码块里的文字永远不会被自动链接。

<DemoExample :demo="richtextAutoLink" description="在默认插槽中启用自动链接插件。" locale="zh" title="自动识别网址和邮箱" />

需要在服务端读写 Markdown 时，从 `@astryx-vue/richtext/markdown` 导入 `markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`。这两个函数不依赖浏览器 DOM。

完整的属性、事件和插槽见[属性文档](/components/rich-text-editor/props)。

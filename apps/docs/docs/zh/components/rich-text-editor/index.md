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

```bash
pnpm add @astryx-vue/richtext
```

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

## 键盘操作

| 操作 | 按键 |
| --- | --- |
| 在代码块中换行 | <kbd>Enter</kbd> |
| 在表格单元格之间移动 | 方向键 |
| 在代码块或表格末尾创建并进入下方段落 | <kbd>ArrowDown</kbd> |
| 打开或关闭链接对话框 | <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> |
| 离开整个编辑器 | 先按 <kbd>Escape</kbd>，再按 <kbd>Tab</kbd>；反向移动使用 <kbd>Shift</kbd> + <kbd>Tab</kbd> |

光标位于代码块或表格末尾时，<kbd>ArrowDown</kbd> 会在下方没有内容，或者下方紧邻另一个代码块或表格时插入段落。这样可以在这两类块之间补充正文；下方已经是普通内容时，方向键沿用 Lexical 的原生导航。

## 自动链接与服务端转换

将 `RichTextEditorAutoLinkPlugin` 放入编辑器默认插槽，可以把输入的网址和邮箱自动转换为链接；通过 `matchers` 可以扩展匹配规则。

<DemoExample :demo="richtextAutoLink" description="在默认插槽中启用自动链接插件。" locale="zh" title="自动识别网址和邮箱" />

需要在服务端读写 Markdown 时，从 `@astryx-vue/richtext/markdown` 导入 `markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`。这两个函数不依赖浏览器 DOM。

完整的属性、事件和插槽见[属性文档](/components/rich-text-editor/props)。

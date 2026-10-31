# @astryx-vue/richtext

Astryx 富文本（`@astryxdesign/richtext`）的 Vue 3 移植版：基于 Lexical 的所见即所得编辑器、只读视图、工具栏，以及原样往返的 Markdown 导入导出。本项目是非官方移植，与 Meta 无关。

## 安装

```sh
pnpm add @astryx-vue/richtext
pnpm add lexical @lexical/code @lexical/extension @lexical/headless @lexical/history @lexical/html @lexical/link @lexical/list @lexical/markdown @lexical/rich-text @lexical/selection @lexical/table @lexical/utils
```

`vue` 和 `@astryx-vue/core` 是同级的必需依赖。Lexical 那一组是可选 peer 依赖，版本和上游锁在同一个次版本（现在是 `^0.52.0`），只有用到编辑器的部分才需要。

样式分文件，可以整份引入，也可以按需：

```ts
import '@astryx-vue/richtext/richtext.css'
```

> `@lexical/headless` 自己带 `happy-dom` 依赖，所以为了服务端转换装它也会装 `happy-dom`。这是 Lexical 的选择，上游也一样。

## 用法

```vue
<script setup lang="ts">
import { RichTextEditor, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="发版说明" @change="(state) => save(JSON.stringify(state.toJSON()))">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
  </RichTextEditor>
</template>
```

`RichTextEditor` 是非受控的：`defaultValue` 只在创建时读一次，之后内容的变化通过 `@change` 交出来。通过模板引用可以拿到 `focus()`、`clear()`、`getEditorState()`、`getMarkdown()`、`getHTML()`、`getEditor()`。

只读有两套：`<RichTextEditor is-read-only>` 是带标签的表单字段；`<RichTextView :value="json">` 是纯文档内容，没有表单控件的角色，适合展示读进来的持久化内容。

## Markdown 往返

`@astryx-vue/richtext/markdown` 不引入 Vue 组件、不碰 DOM，在 Node、Worker 或者服务端渲染里都能用。

```ts
import { editorStateJSONToMarkdown, markdownToEditorStateJSON } from '@astryx-vue/richtext/markdown'

const state = markdownToEditorStateJSON('# 标题\n\n一些 *强调*。\n')
const markdown = editorStateJSONToMarkdown(state)
```

导入时保留原文：没改过的块原样导出，列表标记、缩进、转义、`&amp;` 这类字符引用、围栏的反引号个数都还在；只有改动过的块按规范写法重写。读文档用的是 core `Markdown` 组件同一套解析器，所以两边对同一篇文档的理解一致。

## 其它导出

- `createRichTextExtension`：采用一个用 `createMarkdownPlugin` 做的 Markdown 插件，让它的节点在编辑器和只读视图里按 core `Markdown` 的方式渲染。
- `sanitizeUrl`、`validateUrl`：链接地址的白名单检查，只放行 http、https、mailto、tel。
- `RichTextEditorAutoLinkPlugin`：把输入或粘贴的网址、邮箱自动变成链接，可选。

## 许可证

MIT

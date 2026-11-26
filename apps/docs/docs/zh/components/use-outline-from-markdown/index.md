---
layout: component-docs
title: useOutlineFromMarkdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useOutlineFromMarkdownDocsArticle } from '../../../../components/demos/use-outline-from-markdown'
</script>

## 使用方法

从一段 Markdown 里把标题抽出来，交给放在正文旁边的 [大纲](/components/outline)。它和 `Markdown` 用同一个解析器、同一套标题 id，所以正文写完整后，每一项都能跳到对应的标题；围栏代码里的井号不会被当成标题。返回的是一个计算属性，正文或选项变了就跟着重算。在组件外面用 `parseOutlineFromMarkdown`。

```ts
import { useOutlineFromMarkdown } from '@astryx-vue/core/Outline'
```

```vue
<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { Outline, useOutlineFromMarkdown } from '@astryx-vue/core/Outline'
import { ref } from 'vue'

const markdown = ref('## 安装\n\n…\n\n## 配置\n\n…')
const items = useOutlineFromMarkdown(markdown)
</script>

<template>
  <Markdown :content="markdown" />
  <Outline :items="items" />
</template>
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 给 `Markdown` 和这个 hook 传同一段文字、同一份插件列表、同样的「是否写完」，正文写完整后目录就和渲染出来的标题对得上。 |
| <Badge variant="success">推荐</Badge> | 插件列表放在组件外面声明。每次读到一个新数组，目录就会重算一遍。 |
| <Badge variant="error">避免</Badge> | 手写目录项，或者用正则去找标题。它们迟早和渲染出来的 id 对不上。 |
| <Badge variant="error">避免</Badge> | 指望流式输出时每一项都有目标。`Markdown` 会逐步显示文字，还会裁掉没写完的语法，所以内容写完之前，某个标题可能还不存在，或者 id 不一样。 |
| <Badge variant="error">避免</Badge> | 指望引用了 `sources` 条目的标题能被跳到。hook 拿不到 `sources`，所以 id 会不同：`# Intro [ref]` 在 `Markdown` 里是 `intro`，hook 给的是 `intro-ref`。 |
| <Badge variant="error">避免</Badge> | 指望嵌套的标题（比如引用块里的）也进目录。只有写在根上的标题才算。 |

## 示例

<DemoExample
  :demo="useOutlineFromMarkdownDocsArticle"
  description="一篇文档风格的文章，旁边是大纲，两者都来自同一段 Markdown，大纲经由 useOutlineFromMarkdown 得到。点 Add section 往文字末尾加一个标题，大纲里会多出一项，点它就跳过去。"
  locale="zh"
  title="useOutlineFromMarkdown —— 文档文章"
/>

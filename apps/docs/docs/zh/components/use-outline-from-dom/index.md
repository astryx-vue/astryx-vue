---
layout: component-docs
title: useOutlineFromDOM
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useOutlineFromDomDocsArticle } from '../../../../components/demos/use-outline-from-dom'
</script>

## 使用方法

从页面里已有的标题生成大纲项。正文不是 Markdown 字符串时用它，把结果交给 [大纲](/components/outline)。标题增删、改字、换 id 时列表会跟着更新。

```ts
import { useOutlineFromDOM } from '@astryx-vue/core/Outline'
```

```vue
<script setup lang="ts">
import { Outline, useOutlineFromDOM } from '@astryx-vue/core/Outline'
import { ref } from 'vue'

const article = ref<HTMLElement | null>(null)
const items = useOutlineFromDOM(article)
</script>

<template>
  <article ref="article">
    <h2 id="install">
      安装
    </h2>
    <h2 id="configure">
      配置
    </h2>
  </article>
  <Outline :items="items" />
</template>
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 给每个要进目录的标题写上 id。没有 id 或没有文字的标题会被略过。 |
| <Badge variant="success">推荐</Badge> | 把 ref 指向文章本身而不是整个页面，文章外面的标题就不会混进目录。 |
| <Badge variant="error">避免</Badge> | 指望 hook 帮标题生成 id。它只读标题上已有的 id。 |
| <Badge variant="error">避免</Badge> | 拿它处理 Markdown 字符串。`useOutlineFromMarkdown` 和 `Markdown` 用同一个解析器和同一套 id。 |

## 示例

<DemoExample
  :demo="useOutlineFromDomDocsArticle"
  description="一篇文章，旁边是大纲，大纲经由 useOutlineFromDOM 从页面里的标题得到。点 Add section 往文章里加一个带 id 的标题，大纲里会多出一项，点它就跳过去。"
  locale="zh"
  title="useOutlineFromDOM —— 文档文章"
/>

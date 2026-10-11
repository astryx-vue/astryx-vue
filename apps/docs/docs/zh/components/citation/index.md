---
layout: component-docs
title: 引文
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { citationLabels, citationNumbers } from '../../../../components/demos/citation'
</script>

## 使用方法

`Citation` 在一句话里标出来源。`label` 是带标题的小胶囊。`number` 是紧凑的上标。`number` 从 1 开始，会读进无障碍名称，数字变体也会把它画出来。

`source.url` 有值时，引文是在新标签页打开的链接，并带 `role="doc-noteref"`。没有 URL 时是 `<span>`，不会假装自己是链接。无障碍名称会本地化，例如「引用 2：发布说明」。`source.title` 为空时，可见文字回退到编号。

`source.icon` 优先于 `source.src`。看起来像 URL 或路径的值画成图片，其他字符串交给 `Icon` 当 CSS 类名。图标只在 label 变体里出现。

```vue
<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
</script>

<template>
  <p>
    参见
    <Citation :number="1" :source="{ title: '发布说明', url: 'https://example.com/notes' }" />
    <Citation :number="1" variant="number" :source="{ title: '发布说明', url: 'https://example.com/notes' }" />
  </p>
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 同一次回答里，同一个来源保持同一个 `number`，胶囊和上标才指向同一条。 |
| <Badge variant="success">推荐</Badge> | `title` 写读者认得出的名字。编号只是没有标题时的退路。 |
| <Badge variant="success">推荐</Badge> | 段落很密时用数字变体；希望不看脚注也能读出来源时用 label。 |
| <Badge variant="error">避免</Badge> | 把一整句放进 `title`。胶囊会截断，无障碍名称也会变成那一整句。 |
| <Badge variant="error">避免</Badge> | 拿引文当普通链接。它是注记，不是导航。 |

## 示例

<DemoExample
  :demo="citationLabels"
  description="两个来源胶囊嵌在句子里，都会在新标签页打开。"
  locale="zh"
  title="标题"
/>

<DemoExample
  :demo="citationNumbers"
  description="上标数字。第二个来源没有 URL，所以不是链接。"
  locale="zh"
  title="编号"
/>

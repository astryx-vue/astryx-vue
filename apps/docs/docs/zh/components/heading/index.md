---
layout: component-docs
title: 标题
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { headingCardGrid, headingHierarchy, headingTruncation } from '../../../../components/demos/heading'
</script>

## 使用方法

`Heading` 用于渲染页面和区块的标题：`level` 决定语义层级（h1–h6），`type` 可以在不改变语义的前提下调整视觉样式，两者搭配能同时照顾文档结构与视觉设计。从独立入口导入即可，结构样式会随组件自动加载：

```vue
<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <Heading :level="1">
    页面标题
  </Heading>
  <Heading :level="2" type="display-2">
    数据概览
  </Heading>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 按文档大纲选择 `level`，保持层级连贯、不跳级，屏幕阅读器和搜索引擎才能正确理解页面结构。 |
| <Badge variant="success">推荐</Badge> | 需要营销页或大号展示效果时，用 `type="display-*"` 覆盖视觉样式，同时保留语义正确的 `level`。 |
| <Badge variant="success">推荐</Badge> | 层级较低的次要标题可以使用 `color="secondary"`，让它在视觉上退后一步，主要标题更突出。 |
| <Badge variant="error">避免</Badge> | 为了视觉大小而选用与页面结构不符的 `level`：视觉样式交给 `type` 控制，语义层级仍由 `level` 决定。 |
| <Badge variant="error">避免</Badge> | 在标题中塞入长段落：标题应简短概括内容，详细说明放到正文里。 |

## 示例

<DemoExample
  :demo="headingCardGrid"
  description="卡片里的标题保持一行，说明用 maxLines 收成两行，这样每张卡片的高度一致。"
  locale="zh"
  title="卡片标题"
/>

<DemoExample
  :demo="headingHierarchy"
  description="一页里的 h1、h2、h3，各自配一段说明。"
  locale="zh"
  title="页面层级"
/>

<DemoExample
  :demo="headingTruncation"
  description="限宽之后，maxLines 为 1 收成一行，为 2 收成两行，末尾是省略号。"
  locale="zh"
  title="截断"
/>

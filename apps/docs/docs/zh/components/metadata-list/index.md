---
layout: component-docs
title: 元数据列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { metadataListBasic, metadataListCollapsible, metadataListHorizontal, metadataListMultiColumn } from '../../../../components/demos/metadata-list'
</script>

## 使用方法

`MetadataList` 排列一组标签和值。`MetadataListItem` 是其中一对。单列时标签在值旁边。多列或数字列数时，标签叠在值上面，轨道按列数重复。`columns="multi"` 使用 `repeat(auto-fill, minmax(280px, 1fr))`。

`orientation="horizontal"` 把每一对排成可换行的一行，并忽略 `columns`、`label` 和 `maxNumOfItems`。`maxNumOfItems` 把多出来的项收进「显示更多」。`label.width` 只在标签位于值旁边时生效。

```vue
<script setup lang="ts">
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'
</script>

<template>
  <MetadataList>
    <MetadataListItem label="名称">
      MetadataList
    </MetadataListItem>
    <MetadataListItem label="状态">
      使用中
    </MetadataListItem>
  </MetadataList>
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 标签写短。读者要看的是值。 |
| <Badge variant="success">推荐</Badge> | 窄的详情栏用单列，宽度够放好几对时用 `multi`。 |
| <Badge variant="success">推荐</Badge> | 字段比页面一次能放下的多时，设置 `maxNumOfItems`。 |
| <Badge variant="error">避免</Badge> | 把一整句放进标签。标签轨道是按短名字留的。 |
| <Badge variant="error">避免</Badge> | 水平排列时还指望列数生效。水平布局会忽略列数。 |


<ComponentAnatomy />

## 示例

<DemoExample
  :demo="metadataListBasic"
  description="单列的键值元数据。"
  locale="zh"
  title="MetadataList — 基础"
/>

<DemoExample
  :demo="metadataListCollapsible"
  description="超过设定条数后，用「显示更多」把其余项收起来。"
  locale="zh"
  title="MetadataList — 可折叠"
/>

<DemoExample
  :demo="metadataListHorizontal"
  description="水平排开，适合一行里放几项紧凑信息。"
  locale="zh"
  title="MetadataList — 水平"
/>

<DemoExample
  :demo="metadataListMultiColumn"
  description="多列网格，其中一项的值是标签。"
  locale="zh"
  title="MetadataList — 多列"
/>

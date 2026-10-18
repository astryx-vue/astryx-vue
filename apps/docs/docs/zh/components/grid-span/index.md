---
layout: component-docs
title: 网格跨列
outline: false
footer: false
---

<script setup lang="ts">
import { gridSpanColumns } from '../../../../components/demos/grid-span'
</script>

## 使用方法

占多列或多行的网格项。

```ts
import { GridSpan } from '@astryx-vue/core/Grid'
```

`GridSpan` 包住 `Grid` 里的一个子项，改的是这个子项占几条轨道。`columns` 写数字就是占几列，写 `full` 就是占满整行；`rows` 是占几行。网格本身的东西——列数、间距、对齐——还是由 `Grid` 管。

`full` 渲染成 `grid-column: 1 / -1`，不管一共几列都能占满一行。跨行要有高度才看得出效果：给 `Grid` 传 `rowHeight` 固定行高；不传的话，被跨过的那几行会按穿过它的最高那一项撑开。

```vue
<script setup lang="ts">
import { Grid, GridSpan } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid :columns="3" :gap="3">
    <GridSpan :columns="2">
      占两列
    </GridSpan>
    <div>普通项</div>
    <GridSpan columns="full">
      占满整行
    </GridSpan>
  </Grid>
</template>
```

## 示例

<DemoExample :demo="gridSpanColumns" title="跨列" description="三列里有两项各占两列。想让网格子项占多列、排出不对称的布局时，就用 GridSpan 包一层。" locale="zh" />

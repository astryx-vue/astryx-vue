---
layout: component-docs
title: 轮播
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { carouselCards, carouselSnap, carouselSnapPaging } from '../../../../components/demos/carousel'
</script>

## 使用方法

`Carousel` 把一行内容横向滚过去。根节点是 `region`，`aria-roledescription` 为 `carousel`。每个直接子节点是一张幻灯片，名称为「第 N 张幻灯片，共 M 张」。

`gap` 是间距档（`0`、`0.5`、`1`、`1.5`、`2`、`3`、`4`）。`padding` 用同一套档位，并同时设置 scroll-padding，吸附点会和内容边缘对齐。`hasSnap` 用原生 CSS 滚动吸附让每一项贴到起始边。改传 [`useSnapPaging()`](/components/use-snap-paging) 的返回值，这一行就在同样的停点上像 iOS 那样翻页：用手指或触控板横扫时，轻扫一下翻一屏，传 `{ pages: 'item' }` 时翻一项；边缘按钮、方向键和 `scrollNext`、`scrollPrev`、`scrollTo` 也都经由同一套翻页来挪。鼠标滚轮和鼠标拖动仍然是原生滚动。`hasEdgeFade` 在仍有溢出的那一侧加上渐隐。

`hasButtons` 在还能滚动时显示上一张和下一张。不能再滚的那一侧按钮会隐藏，也不再是 Tab 停靠点。如果焦点正在这个按钮上，会移到滚动区，滚动位置不变。`hasLoop` 从最后一项回到第一项，内容溢出时两端按钮都保持可用。按住 Shift 拨一格滚轮，这一行横向滚一次。

滚动区是一个和轮播同名的分组。只有内容溢出时它才是 Tab 停靠点，聚焦后用左右方向键滚动。它的焦点环由轮播画在边缘渐隐之上，两侧按钮收在焦点环以内。

模板 ref 上可以调用 `scrollNext`、`scrollPrev`、`scrollTo`、`canScrollNext`、`canScrollPrev`。

```vue
<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Carousel } from '@astryx-vue/core/Carousel'
</script>

<template>
  <Carousel :gap="2" has-snap label="功能卡片" style="max-width: 520px">
    <Card :width="200" :min-height="100">
      设计系统
    </Card>
    <Card :width="200" :min-height="100">
      文档
    </Card>
  </Carousel>
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `label` 给这组内容起名，例如「功能卡片」。 |
| <Badge variant="success">推荐</Badge> | 每张卡片用稳定宽度，一次滚动才看得到固定的几张。 |
| <Badge variant="success">推荐</Badge> | 希望停在某一项上、而不是停在两项中间时，打开 `hasSnap`。 |
| <Badge variant="error">避免</Badge> | 只放一项而且放得下。按钮不会出现，这一行就只是普通横排。 |
| <Badge variant="error">避免</Badge> | 内容溢出时同时关掉按钮和边缘渐隐。至少留一个，让人知道旁边还有内容。 |


<ComponentAnatomy />

## 示例


<DemoExample
  :demo="carouselCards"
  description="一行可以横向滑动、并吸附对齐的卡片。适合功能列表、商品列表，或任何超出可用宽度的卡片。轮播会自动加上边缘渐隐和导航按钮。"
  locale="zh"
  title="Carousel — 卡片"
/>

<DemoExample
  :demo="carouselSnap"
  description="带导航按钮和成员卡片的吸附轮播。滚动后每张卡片贴到起始边。适合一次看一项，而不是连成一条看。"
  locale="zh"
  title="Carousel — 吸附"
/>

<DemoExample
  :demo="carouselSnapPaging"
  description="用 iOS 式吸附分页的引导页。轻扫一下翻一屏，打开开关后翻一张。翻到一半时按住能接住它，最后总是停在某张卡片的起始边。"
  locale="zh"
  title="Carousel — 吸附分页"
/>

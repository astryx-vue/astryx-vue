---
layout: component-docs
title: useSnapPaging
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { carouselSnapPaging } from '../../../../components/demos/carousel'
</script>

## 使用方法

`useSnapPaging` 让 [轮播](/components/carousel) 在原生吸附的停点上像 iOS 那样翻页：把返回值交给 `:has-snap="paging"` 就行。用手指拖或在触控板上横扫时，这一行先跟着手走；松手时轻扫一下翻一屏，传 `{ pages: 'item' }` 时翻一项，最后停在某一项的起始边。不管扫得多快，离起手的那一页最多走一页。翻到一半时手指按上去能接住它，按着不动再松开，就停到最近的一页。

「一屏」的那一页，落在离一屏之外最近的那一项起始边上，并且至少往前走一项。停点离这一行末端不到半步的那一项归进最后一页，所以不管怎么滚（包括原生吸附），都停在这一行真正的尽头，不会差一两个像素。

鼠标滚轮和鼠标拖动仍然是原生滚动和原生吸附。边缘按钮、方向键、Shift 加滚轮，以及模板 ref 上的 `scrollNext`、`scrollPrev`、`scrollTo`，都经由同一套翻页来挪，所以这些移动也能被手指接住。翻页按住这一行期间，边缘按钮和渐隐跟着这一行此刻显示的位置变，和这一行在同一帧里变化。系统打开「减少动态效果」时，翻页直接跳到目标页。

```ts
import { useSnapPaging } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useSnapPaging } from '@astryx-vue/core'
import { Carousel } from '@astryx-vue/core/Carousel'

const paging = useSnapPaging({ pages: 'item' })
</script>

<template>
  <Carousel :has-snap="paging" label="照片">
    <!-- 卡片 -->
  </Carousel>
</template>
```

只有拿到这个值的轮播才会加载翻页代码。`options` 可以是 ref 或 getter，新的 `pages` 从下一次轻扫开始生效。轮播一直用它第一次挂上的那个值。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在一次看一屏的内容上，比如引导页或照片条，快速轻扫也不该跳过下一屏。 |
| <Badge variant="success">推荐</Badge> | 一屏同时露出好几项、每次轻扫只想挪一项时，传 `{ pages: 'item' }`。 |
| <Badge variant="error">避免</Badge> | 用在需要快速浏览的一行上；普通的 `hasSnap` 保留原生惯性，一次横扫能划过好几项。 |

## 示例

<DemoExample
  :demo="carouselSnapPaging"
  description="用吸附分页的引导页。轻扫一下翻一屏，打开开关后翻一张。"
  locale="zh"
  title="useSnapPaging — 引导页"
/>

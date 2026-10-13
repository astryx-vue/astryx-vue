---
layout: component-docs
title: 灯箱
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { lightboxGallery, lightboxOverview, lightboxVideo, lightboxZoom } from '../../../../components/demos/lightbox'
</script>

## 使用方法

`Lightbox` 用原生 `<dialog>` 打开媒体。`isOpen` 用 `v-model:is-open` 绑定。`media` 传一个对象就是单张图片或一段视频。传数组就是图库：上一张、下一张和计数一直留在页面上，到头时禁用，而不是消失。

`useLightbox({ media })` 管打开状态和下标。把 `bindings` 绑到 `Lightbox` 上，缩略图里调用 `open(index)`。

`hasZoom` 把图片变成按钮。双击、Enter、Space、`+`、`-` 在 1 倍和 2 倍之间切换。放大后可以拖动，方向键每次平移 50px。拖动结束时的那一下点击不会把对话框关掉。视频用浏览器自己的控件，不能缩放。`hasAutoPlay` 在显示出视频时开始播放。

Escape 和关闭按钮都会发出 `update:isOpen`，值为 `false`。点对话框或画面外的遮罩也一样。

```vue
<script setup lang="ts">
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'

const photo = {
  src: '/template-assets/light-scene-horizontal-1.png',
  alt: 'Coastal shoreline with ocean waves',
  caption: 'A scenic coastline with waves rolling onto a sandy beach beneath a clear sky.',
}
const { bindings, open } = useLightbox({ media: photo })
</script>

<template>
  <Thumbnail :src="photo.src" :alt="photo.alt" :label="photo.alt" @click="open()" />
  <Lightbox v-bind="bindings" />
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | `alt` 写出这是什么，`caption` 补上画面里看不出来的信息。 |
| <Badge variant="success">推荐</Badge> | 图库从读者点的那张打开，调用 `open(index)`。 |
| <Badge variant="success">推荐</Badge> | 只有静止图片、而且细节值得看时才打开 `hasZoom`。 |
| <Badge variant="error">避免</Badge> | 给视频加 `hasZoom`。视频保持浏览器控件，缩放不会生效。 |
| <Badge variant="error">避免</Badge> | `alt` 留空。对话框名称和图片名称都从这里来。 |

## 示例

<DemoExample
  :demo="lightboxOverview"
  description="带说明文字的全屏图片查看器。"
  locale="zh"
  title="Lightbox"
/>

<DemoExample
  :demo="lightboxGallery"
  description="缩略图网格打开全屏图库。点任意一张，灯箱就从那一张开始。上一张和下一张可以不关闭就翻完。"
  locale="zh"
  title="Lightbox — 图库"
/>

<DemoExample
  :demo="lightboxVideo"
  description="在灯箱里打开视频，使用浏览器自带控件。视频不能缩放，也不能平移。"
  locale="zh"
  title="Lightbox — 视频"
/>

<DemoExample
  :demo="lightboxZoom"
  description="打开缩放和平移。双击图片放大，拖动查看。再双击一次，或点关闭，回到原大小并退出。"
  locale="zh"
  title="Lightbox — 缩放"
/>

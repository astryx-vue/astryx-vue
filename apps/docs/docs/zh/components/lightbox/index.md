---
layout: component-docs
title: 灯箱
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { lightboxGallery, lightboxHookGrid, lightboxVideo, lightboxZoom } from '../../../../components/demos/lightbox'
</script>

## 使用方法

`Lightbox` 用原生 `<dialog>` 打开媒体。`isOpen` 用 `v-model:is-open` 绑定。`media` 传一个对象就是单张图片或一段视频。传数组就是图库：上一张、下一张和计数一直留在页面上，到头时禁用，而不是消失。方向键跟着书写方向走：从右往左的页面里 ArrowLeft 去下一张，和左边的「下一张」按钮一致。下标越界时显示最近的一项；小数四舍五入到最近的一项，`NaN` 显示第一项。第一项还没到就打开的灯箱，等它到了再打开。

`useLightbox({ media })` 管打开状态和下标。把 `bindings` 绑到 `Lightbox` 上，缩略图里调用 `open(index)`。

图注放在照片下面一条两行高的区域里，垫着一块底色，压在什么照片上都看得清；更长的图注末尾有「更多」。单张照片有图注时用同样的区域，没有图注就没有这条区域。

`hasZoom` 把图片变成按钮。鼠标双击在点到的地方放大到 2 倍，再双击回去；Enter、Space、`+`、`-` 以中心放大 2 倍和还原，`0` 回到适应大小（Ctrl 或 Cmd 加 `0` 仍是浏览器自己的页面缩放）。放大后可以拖动、用触控板滚动平移，方向键每次平移 50px，到边就停。拖动结束时的那一下点击不会把对话框关掉。能缩放时控件垫着一层半透明底色，放大的照片跑到控件下面也看得清。视频用浏览器自己的控件，不能缩放。`hasAutoPlay` 在打开的灯箱里显示出视频时开始播放；关闭灯箱会停下正在播放的视频。

## 手势

手感照着 iPhone 的照片 App 做，时长、曲线、弹簧和橡皮筋系数都取自上游。

- **捏合缩放**（要 `hasZoom`）：两根手指在手指中间缩放，触控板捏合和 Ctrl + 滚轮也一样。缩过头会有橡皮筋的阻力，松手弹回最大或适应大小。
- **双击放大**（要 `hasZoom`）：手指双击在点到的地方放大到铺满灯箱，再双击回去。
- **放大后平移**：拖到哪儿照片跟到哪儿，松手带惯性滑一段；拖出边缘有橡皮筋阻力，松手弹回。
- **横扫翻页**（图集，触屏）：像照片 App 一样一页一页翻，页和页之间隔 40pt。拖过一半或轻扫一下就翻过去，一次最多一页；两头拖不动，会被橡皮筋拉住。放大的照片先拖到边，下一下才翻页，翻走之后留在身后的照片回到适应大小。受控的 `index` 没有接受新的一页时，轨道弹回原来那一页。视频底边 48px 是播放控件那一条，从那里开始的拖动留给视频。精细指针（鼠标）下用按钮和方向键翻页，换页直接到位。
- **往下拖关闭**（触屏，照片在适应大小时）：照片跟着手指走、越拖越小，背景和控件跟着变淡。拖得够远或往下甩一下就关闭，照片继续往下滑出屏幕；不够就弹回原位。
- **点空白关闭**：手指点在照片和图注旁边，和点遮罩一样关闭。

系统打开「减少动效」时，手指松手后的弹回和离场改成就地淡入淡出；平移的惯性保留，因为那是人自己的动作。

Escape 和关闭按钮都会发出 `update:isOpen`，值为 `false`。点在照片和图注区域以外的任何地方也一样，包括比灯箱窄的照片两旁的空白。Tab 只在打开的灯箱里循环，读屏在灯箱里面就能听到换页的播报。灯箱关闭、或打开着就被移除时，焦点回到打开它的那个元素。

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


<ComponentAnatomy />

## 示例

<DemoExample
  :demo="lightboxGallery"
  description="缩略图网格打开全屏图库。点任意一张，灯箱就从那一张开始。上一张和下一张可以不关闭就翻完。"
  locale="zh"
  title="图库"
/>

<DemoExample
  :demo="lightboxVideo"
  description="在灯箱里打开视频，使用浏览器自带控件。视频不能缩放，也不能平移。"
  locale="zh"
  title="视频"
/>

<DemoExample
  :demo="lightboxZoom"
  description="打开缩放和平移。双击或捏合放大，拖动查看。再双击一次，或点关闭，回到原大小并退出。"
  locale="zh"
  title="缩放"
/>

<DemoExample
  :demo="lightboxHookGrid"
  description="直接调用 useLightbox 的照片网格：getTriggerProps(index) 把每张缩略图变成一个按钮，点击、回车或空格都会在这张照片处打开图库。"
  locale="zh"
  title="useLightbox —— 照片网格"
/>

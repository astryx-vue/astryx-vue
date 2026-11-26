---
layout: component-docs
title: useLightbox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLightboxGallery } from '../../../../components/demos/use-lightbox'
</script>

## 用法

管着 `Lightbox` 打开状态和图集下标的无界面组合式函数。缩略图、按钮这类放在查看器外面的控件决定它显示什么时用它。

```ts
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'
```

把 `bindings` 绑到 `Lightbox` 上，在缩略图里调 `open(index)`：

```vue
<script setup lang="ts">
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'

const photos = [
  { src: '/a.png', alt: '第一张', caption: '第一张照片。' },
  { src: '/b.png', alt: '第二张', caption: '第二张照片。' },
]
const { bindings, open } = useLightbox({ media: photos })
</script>

<template>
  <button v-for="(photo, index) in photos" :key="photo.src" type="button" @click="open(index)">
    {{ photo.alt }}
  </button>
  <Lightbox v-bind="bindings" />
</template>
```

触发器不是原生按钮时，`getTriggerProps(index)` 返回 `role="button"`、`tabindex="0"`、`aria-haspopup="dialog"`，以及回车和空格激活。查看器关闭后，焦点回到打开它的元素。

## 最佳实践

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 给每张缩略图一个名字，比如照片的 `alt`，让读屏用户知道每个按钮会打开什么。 |
| <Badge variant="success">推荐</Badge> | 一个控件打开一个查看器时，直接用 `Lightbox` 加 `v-model:is-open`；多个触发器共用一个图集时再用这个函数。 |
| <Badge variant="error">不推荐</Badge> | 每张缩略图配一个 `Lightbox`：图集需要一个认识整个 `media` 数组的查看器。 |

## 示例

一排照片缩略图，点哪张就从哪张开始全屏浏览。

<DemoExample :demo="useLightboxGallery" title="图集网格" description="每张缩略图调用 `open(index)`，用 `bindings` 绑定的唯一一个 `Lightbox` 显示这张照片并可翻看其余照片。" locale="zh" />

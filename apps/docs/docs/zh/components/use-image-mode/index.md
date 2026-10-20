---
layout: component-docs
title: useImageMode
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

采样图片的像素，判断它整体偏暗还是偏亮。采样通过 `OffscreenCanvas` 进行，不往页面上画任何东西。亮度用 APCA 的感知亮度（先把 sRGB 线性化，再做一次幂曲线），饱和色也能判得准。整个过程不在绘制路径上：没有可见画布，也不会引起布局抖动。可以只采一块区域，用来判断文字浮层所在位置的亮度。还在加载时返回 `null`，跨域或网络失败时退回 `fallback`。

实现上会先 fetch 图片，画进 10×10 的离屏画布再取平均，所以 `src` 一变，还没回来的那次结果就作废。`src` 和 `options` 都可以写成 ref 或 getter。

```ts
import { useImageMode } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 和 `MediaTheme` 一起用，让图片上的文字颜色跟着背景图自动切换。 |
| <Badge variant="success">推荐</Badge> | 用 `region` 只采文字浮层会出现的那一块，结果更准。 |
| <Badge variant="error">避免</Badge> | 用在变化很快的图上（例如视频帧）；每次 `src` 变化都会重新拉取和分析。 |

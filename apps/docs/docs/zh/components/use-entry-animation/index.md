---
layout: component-docs
title: useEntryAnimation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

返回一个 class，元素挂载时用它播放入场动画。只有首屏画完之后才动态插进来的元素才有动画；页面一开始就渲染出来的元素不播。时长和缓动取自 Astryx 的 motion token，动画节奏和其他地方保持一致。服务端渲染时不会有任何动画。

```ts
import { useEntryAnimation } from '@astryx-vue/core'
```

把返回的 `entryClass` 和元素自己的 class 写在一起；Vue 会合并 `class` 绑定，不会把原来的覆盖掉。不该播动画时 `entryClass` 是 `null`，而 `null` 会被 class 绑定直接丢掉，正好是不播的效果。这个 class 带的是 `styles/motion.css` 里那套共享关键帧，所以时长、缓动和「减少动态效果」的兜底都跟着主题走。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在按条件渲染的元素上：校验提示、toast、展开的区块。 |
| <Badge variant="success">推荐</Badge> | 把返回的 class 和元素自己的 class 写在一起，动画叠在原有样式上，而不是替掉它。 |
| <Badge variant="error">避免</Badge> | 用在首屏就该看见的元素上。它们不会播动画。 |

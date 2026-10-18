---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

Astryx 里每个可按的地方都用的触摸按压模型，给自己画按压反馈的组件也用这一套。手指按下去的时候，CSS 的 `:active` 会立刻亮，而且滚动已经开始了它还可能亮着；按压模型反过来：先等 150 毫秒，确认这真是按压；手指一动超过 10 像素、或者页面滚走了，马上作废，这次手势里不再亮回来；快速点一下则在抬手时补上；松手后用 200 毫秒淡出。这几个时间和系统列表的手感一致。一个文档级控制器给所有带标记的元素做这件事（第一个用到的组件装上，最后一个卸载时拆掉），所以调用这个函数不会给你的元素加监听，也不加状态。鼠标上的表现不变：留着你的 `:active`，按内置组件的写法在 `@media (pointer: coarse)` 里把它丢掉就行。

```ts
import { usePressFeedback } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { usePressFeedback } from '@astryx-vue/core'

const { pressableProps } = usePressFeedback()
</script>

<template>
  <button type="button" class="card" v-bind="pressableProps">
    按我
  </button>
</template>
```

样式文件 `styles/pressable.css` 会跟着这个函数一起带上：它在带标记的元素上铺一层 `::after` 画按下的颜色，给鼠标留着 `:active`，松手时淡出。元素只要是个定位盒子就行，样式表会设好。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 结果铺在「背景画按压」的那个元素上，用 `--astryx-color-overlay-pressed` 调颜色。 |
| <Badge variant="success">推荐</Badge> | 各种指针都交给自带的样式：它给鼠标留着 `:active`，在 `@media (pointer: coarse)` 里丢掉，手指只会看到按压模型。自己再写一条 `:active`，手指下也会亮，落手就亮、滚动也不灭。 |
| <Badge variant="error">不要</Badge> | 为了跟按压给元素加指针监听或者组件状态；控制器已经写好属性了，每个元素一套监听正是长列表受不了的。 |
| <Badge variant="error">不要</Badge> | 给 Astryx 组件渲染出来的控件再调一次；那些本来就有标记，最里面那个带标记的元素才算数。 |

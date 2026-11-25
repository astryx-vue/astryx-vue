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

Astryx 里每个可按的地方都用的触摸按压模型，给自己画按压反馈的组件也用这一套。手指按下去的时候，CSS 的 `:active` 会立刻亮，而且滚动已经开始了它还可能亮着；按压模型照系统控件的做法来：不在滚动区域里的控件，手指落下那一帧就亮；滚动区域里的先等 150 毫秒（从触摸本身算起，页面再忙也不会更晚），确认这不是一次滑动；手指一动超过 10 像素、或者页面滚走了，马上作废，这次手势里不再亮回来；快速点一下则在抬手时补上；松手后按主题的退出时长（`--astryx-duration-exit`）淡出，开了「减少动态效果」时最多 200 毫秒。一个文档级控制器给所有带标记的元素做这件事（第一个用到的组件装上，最后一个卸载时拆掉），所以调用这个函数不会给你的元素加监听，也不加状态。鼠标上的表现不变：留着你的 `:active`，按内置组件的写法在 `@media (pointer: coarse)` 里把它丢掉就行。

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

样式文件 `styles/pressable.css` 会跟着这个函数一起带上：默认的 `astryx-pressable` 类在元素的 `::after` 上画按下的颜色，给鼠标留着 `:active`，手指下读控制器写的 `data-astryx-press`（`on` 是按住，`fading` 是抬手淡出）。按压强度是注册过的 `--astryx-press-alpha`，淡出就是它从 1 降到 0。组件想自己画按压时传 `{ hasOverlay: false }`，在自己的样式里用 `var(--_press-paint-image)` 画 `[data-astryx-press]` 两种状态。

像列表行、卡片这种里面还放着别的按钮或输入框的容器，传 `{ isContainer: true }`：手指按在里面别的控件上时，那一下不会触发容器自己的动作，所以容器不亮。容器自己的动作元素（比如行里那个看不见的链接）摊上返回的 `pressActionProps`，按它照样算按容器。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 结果铺在「背景画按压」的那个元素上，用 `--astryx-color-overlay-pressed` 调颜色。 |
| <Badge variant="success">推荐</Badge> | 各种指针都交给自带的样式：它给鼠标留着 `:active`，在 `@media (pointer: coarse)` 里丢掉，手指只会看到按压模型。自己再写一条 `:active`，手指下也会亮，落手就亮、滚动也不灭。 |
| <Badge variant="error">不要</Badge> | 为了跟按压给元素加指针监听或者组件状态；控制器已经写好属性了，每个元素一套监听正是长列表受不了的。 |
| <Badge variant="error">不要</Badge> | 给 Astryx 组件渲染出来的控件再调一次；那些本来就有标记，最里面那个带标记的元素才算数。 |

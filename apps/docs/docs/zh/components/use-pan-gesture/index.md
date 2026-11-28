---
layout: component-docs
title: usePanGesture
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { usePanGestureFollowCard } from '../../../../components/demos/use-pan-gesture'
</script>

## 使用方法

`usePanGesture` 把元素上的一次拖动报成一串数值，元素怎么动由你自己决定：跟手的卡片、拉把手打开的抽屉都可以用它。手指、鼠标、触控笔都能拖。

每次拖动开始、移动、松手、被取消时，`onPan` 都会收到 `{ state, translation, velocity }`：

- `state`：`'began'`、`'changed'`、`'ended'` 或 `'cancelled'`。
- `translation`：从拖动开始算起移动了多少像素。起拖前要走的那一小段不算在里面，所以跟着它走的元素不会突然一跳。
- `velocity`：每秒多少像素。`'ended'` 时是松手那一刻的速度（手指停住再抬起就是 0），`'cancelled'` 时是 0。

```ts
import { usePanGesture } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { usePanGesture } from '@astryx-vue/core'
import { useTemplateRef } from 'vue'

const handle = useTemplateRef<HTMLElement>('handle')

usePanGesture(handle, {
  axis: 'y',
  onPan: ({ state, translation, velocity }) => {
    // 拖动时跟着 translation 走，松手时把 velocity 交给收尾的动画。
  },
})
</script>

<template>
  <div ref="handle">
    把手
  </div>
</template>
```

拖动和 UIKit 的 `UIPanGestureRecognizer` 一样，手指走过 10pt 才认领这次触摸，所以轻点还是轻点，按住、长按都不会被当成拖动。

- 传了 `axis`：只认这条轴上的拖动，另一条轴的分量永远是 0；从元素上开始的、横着这条轴的滚动仍然归页面。
- 不传 `axis`：哪个方向都接，所以从元素上开始的手指滚动会拖元素，而不是滚页面。触控板的滚动始终滚页面。
- 鼠标或触控笔从可选中的文字上开始拖，会选中文字，拖动什么也不报。给这段文字加上 `user-select: none`。

组合式函数为 ref 指向的元素创建一个拖动；ref 换到别的节点，或者 `axis` 变了，就重新创建一个；组件卸载时销毁。`onPan` 每次用到时现读，换一个新函数不会重建任何东西。卸载时正在进行的拖动直接结束，不会再调用 `onPan`。服务端渲染时不碰 DOM。`target` 也可以是 getter 或元素本身。

不在组件里时（比如普通脚本），用 `createPanGesture(element, options)`。它接受同样的选项，返回 `{ destroy }`：移除它加过的所有监听，并取消正在进行的拖动。

```ts
import { createPanGesture } from '@astryx-vue/core'

const pan = createPanGesture(element, { axis: 'x', onPan: event => console.log(event) })
pan.destroy()
```

拖动本身不移动任何东西，所以「减弱动态效果」要由你驱动的动画来照顾。拖动也没有自己的键盘或读屏路径：它做的事，需要另给一条路，比如按钮或方向键（WCAG 2.5.7）。组件已经提供这个行为时，直接用组件的属性：BottomSheet 的 `snapPoints`、Carousel 的 `hasSnap`。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 元素的位置 = 拖动开始时的位置 + `translation`，这样从认领那一刻起就跟着手指走。 |
| <Badge variant="success">推荐</Badge> | `ended` 时把 `velocity` 交给收尾的动画，甩一下就带着松手的速度继续走。 |
| <Badge variant="success">推荐</Badge> | 给每个拖动配一条键盘和读屏也能走的路，比如按钮、方向键或菜单。 |
| <Badge variant="error">避免</Badge> | 组件属性已经能做到时自己重写：抽屉用 BottomSheet 的 `snapPoints`，分页用 Carousel 的 `hasSnap`。 |

## 示例

<DemoExample
  :demo="usePanGestureFollowCard"
  description="拖动卡片，它跟着手指走；松手后带着手上的速度弹回原位。下方显示拖动此刻的状态。"
  locale="zh"
  title="usePanGesture — 跟手的卡片"
/>

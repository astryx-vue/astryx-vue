---
layout: component-docs
title: useAnimator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useAnimatorDragCard } from '../../../../components/demos/use-animator'
</script>

## 使用方法

`useAnimator` 用组件库自己的弹簧和惯性来驱动一个元素。把模板 ref 交给它，拿回一个 animator：

- `animate(target, options?)`：用「状态切换」弹簧把通道带到目标值。不传速度时，从元素此刻的速度接着走，所以打断上一次动画也很顺滑。传 `velocity`（比如拖拽松手时的速度）就从这个速度起步。
- `decay(velocity)`：从松手速度开始惯性滑行，像滚动视图的惯性一样慢慢停下。没有边界，透明度停在 0 或 1。
- `set(values)`：直接跳到这些值，适合拖拽时每一帧的写入。
- `get()`、`getVelocity()`：读每个通道此刻的值和速度。
- `stop()`：让所有通道停在当前位置。

通道有五个：`x`、`y`（像素位移）、`scale`（1 是原大小）、`rotate`（角度，顺时针）、`opacity`（0 到 1）。每个方法只动传进去的通道，其余的保持原样。`animate` 和 `decay` 返回的 Promise 在到达终点时 resolve；后面的调用接管了其中任一通道时，也会立刻 resolve。

```ts
import { useAnimator } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useAnimator } from '@astryx-vue/core'
import { useTemplateRef } from 'vue'

const card = useTemplateRef<HTMLElement>('card')
const animator = useAnimator(card)
</script>

<template>
  <div ref="card">
    卡片
  </div>
  <button type="button" @click="animator.animate({ scale: 1.2 })">
    弹一下
  </button>
</template>
```

animator 只创建一次，动画不会让组件重新渲染。它跟着 ref 当前指向的元素走：换成新元素时，新元素从静止状态开始；元素卸载时，正在跑的动画停下、数值清空。没有元素时每个调用都不做事，`animate` 和 `decay` 立刻 resolve。服务端渲染时不碰 DOM。`target` 也可以是 getter 或元素本身。

系统开启「减弱动态效果」时，每次调用都会换成替代方案：触屏上位移变成短暂的淡出淡入，鼠标环境下直接落到终点。松手后的惯性滑行保留。弹簧的快慢跟着主题 `motion.tempo` 走。

不在组件里时（比如普通脚本），用 `createAnimator(element)`。它返回同样的方法，外加 `destroy()`：停下所有动画、放开元素，之后调用都不做事。

```ts
import { createAnimator } from '@astryx-vue/core'

const animator = createAnimator(element)
await animator.animate({ x: 0, rotate: 0 }, { velocity: { x: -900 } })
animator.destroy()
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 拖拽时用 `set` 跟手，松手时把测到的速度传给 `animate` 或 `decay`，动作就能接上。 |
| <Badge variant="success">推荐</Badge> | 一个元素只配一个 animator。 |
| <Badge variant="error">避免</Badge> | 两个 animator 驱动同一个元素，它们会互相覆盖。 |
| <Badge variant="error">避免</Badge> | 用它做普通的进场退场；CSS 过渡和共享的 `astryx-motion-*` 类更省事。 |

## 示例

<DemoExample
  :demo="useAnimatorDragCard"
  description="拖动卡片，松手后它带着手上的速度弹回原位。按钮分别演示弹一下、旋转、甩出去的惯性滑行和复位。"
  locale="zh"
  title="useAnimator — 拖拽回弹"
/>

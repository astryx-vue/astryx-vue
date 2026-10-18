---
layout: component-docs
title: useScrollableArea
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

给调用方自己搭的结构加上一套标准的、跟着书写方向走的滚动行为。一个轴要真的能用，得同时满足两件事：这一轴算出来的 `overflow` 是能滚的，并且内容和盒子差得超过共用的 1px 容差。视口和内容盒两块都在观察范围里。

把 `viewport` 当函数 ref 绑到滚动的那块上，把 `content` 绑到装内容的盒子上。`viewportAttrs` 里是 `role`、`aria-label`、`tabindex`，还有按当前测量结果写出的 `data-scroll-*`；`viewportStyle` 里是 `overflow` 和 `overscroll-behavior`。`label` 是必填的。选项是按响应式读取的，所以组件的 `props` 也可以直接传进来，后面变了也会跟着更新。

```ts
import { useScrollableArea } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useScrollableArea } from '@astryx-vue/core'

const { content, viewport, viewportAttrs, viewportStyle } = useScrollableArea({
  axis: 'block',
  label: '更新日志',
})
</script>

<template>
  <div :ref="viewport" v-bind="viewportAttrs" :style="viewportStyle">
    <div :ref="content">
      很长很长的内容
    </div>
  </div>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | `viewport` 和 `content` 两个都绑上。内容盒是真的在观察的，溢出变化才跟得上。 |
| <Badge variant="success">Do</Badge> | 给这块区域一个简短的 `label`。视口只有在真的能滚的时候才进键盘顺序。 |
| <Badge variant="success">Do</Badge> | `axis` 写你真正想滚的方向，只有两个方向都要滚时才用 `both`。 |
| <Badge variant="success">Do</Badge> | `overscroll` 保持 `allow`，除非手势滑到头就该停在这个盒子上。 |
| <Badge variant="error">Don't</Badge> | 自己在视口上写 `overflow`。`viewportStyle` 会按测量结果在 `clip` 和 `auto` 之间挑。 |
| <Badge variant="error">Don't</Badge> | 再套一层 overflow 容器。一块视口应该独占滚动。 |

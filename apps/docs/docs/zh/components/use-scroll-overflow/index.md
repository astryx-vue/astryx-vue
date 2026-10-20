---
layout: component-docs
title: useScrollOverflow
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

盯着一个横向滚动的容器，报告两边有没有被挡住。返回一个 ref 回调和几条布尔状态，用户滚动或容器尺寸变化时会跟着更新。滚动监听和 ResizeObserver 一起用。容差 1px，免得因为亚像素算出来一堆假的溢出。

`scrollRef` 是函数 ref，用 `:ref="scrollRef"` 绑上去。容器自己要带上 `overflow-x: auto` 或 `overflow-x: scroll`，这个函数只读它已有的边界。

```ts
import { useScrollOverflow } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useScrollOverflow } from '@astryx-vue/core'

const { hasOverflow, overflowEnd, overflowStart, scrollRef } = useScrollOverflow()
</script>

<template>
  <div class="rail">
    <button :disabled="!overflowStart">
      上一页
    </button>
    <div :ref="scrollRef" class="rail-track">
      <slot />
    </div>
    <button :disabled="!overflowEnd">
      更多
    </button>
  </div>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 用它决定轮播和横向列表两边的前进、后退按钮显不显示，或者边缘的渐隐要不要露出来。 |
| <Badge variant="success">Do</Badge> | `scrollRef` 绑到的容器要带 `overflow-x: auto` 或 `overflow-x: scroll`。 |
| <Badge variant="error">Don't</Badge> | 拿它看竖向滚动，这个函数只量横向溢出。 |

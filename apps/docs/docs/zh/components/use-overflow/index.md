---
layout: component-docs
title: useOverflow
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

在屏幕外的那块隐藏容器里把所有子项都排一遍，量出当前宽度能放下几项，这样切换时不会闪。容器和子项尺寸变化都用 ResizeObserver 盯着。测量容器里按顺序放全部项，最后可以再放一个溢出指示器，给它标上 `data-overflow-indicator`。

这块测量容器画在看不见的地方，所以每一项都还是真实宽度。给它加上 `inert`，它就不会进键盘顺序，也不会被读屏读到。看得见的容器只渲染 `visibleCount` 项，再自己放一个溢出提示，这个提示不参与测量。

这两个容器在这里都是模板 ref，用 `ref` 绑上去就行。`visibleCount`、`rows`、`rowHeight` 都是 ref，可以直接拿去渲染；想立刻重量一次就调 `remeasure()`。

```ts
import { useOverflow } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useOverflow } from '@astryx-vue/core'

const items = ['一', '二', '三', '四', '五']
const { containerRef, hasOverflow, measureRef, visibleCount } = useOverflow(items.length, { gap: 8 })
</script>

<template>
  <div ref="containerRef" class="row">
    <button v-for="item in items.slice(0, visibleCount)" :key="item">
      {{ item }}
    </button>
    <button v-if="hasOverflow">
      +{{ items.length - visibleCount }} 更多
    </button>
  </div>

  <div ref="measureRef" class="row" inert>
    <button v-for="item in items" :key="item">
      {{ item }}
    </button>
    <button data-overflow-indicator>
      +{{ items.length }} 更多
    </button>
  </div>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 全部项都渲染进 `measureRef` 那块隐藏容器，只有前 `visibleCount` 项渲染进 `containerRef` 那块看得见的容器。 |
| <Badge variant="success">Do</Badge> | 测量容器最后放一个溢出指示器（比如「+N 更多」按钮），并给它标上 `data-overflow-indicator`。 |
| <Badge variant="error">Don't</Badge> | 拿它量竖向溢出，这个函数只量横向宽度。 |

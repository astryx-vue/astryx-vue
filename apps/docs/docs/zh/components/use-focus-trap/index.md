---
layout: component-docs
title: useFocusTrap
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

按 WAI-ARIA 的对话框焦点陷阱做法，把焦点关在一个容器里。陷阱开着的时候会监听文档上的 `keydown`，Tab 和 Shift+Tab 到头就绕回另一头，焦点在容器里循环，走不出去。打开陷阱时也会把焦点送进去：优先用 `initialFocus` 返回的元素，没有就用第一个可聚焦元素。关掉就是全部拆卸，所以对话框只要切换开关，不必卸载 hook。

陷阱关闭或卸载时，焦点会还给打开前聚焦的那个元素。焦点已经被别处拿走、或者从头到尾没进过容器，就不动它——像下拉框这种把焦点留在触发器上的浮层不会被打扰。容器外面的鼠标点击不拦，那是轻关闭要处理的。

```ts
import { useFocusTrap } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useFocusTrap } from '@astryx-vue/core'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const trap = useFocusTrap({
  container: containerRef,
  isActive: isOpen,
  onEscape: () => { isOpen.value = false },
})
</script>

<template>
  <div ref="containerRef" role="dialog">
    <button @click="trap.focusFirst()">
      第一个输入项
    </button>
  </div>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 打开对话框或模态时调 `focusFirst()`，把焦点送进被关住的区域。 |
| <Badge variant="success">推荐</Badge> | 传 `onEscape`，容器里按下 Escape 时关掉对话框。 |
| <Badge variant="success">推荐</Badge> | 关闭后的焦点还原用内置的就行；只有确实要送别处时，才自己再写一套。 |
| <Badge variant="error">避免</Badge> | 用在 Tooltip、下拉菜单这类非模态内容上；它们要的是轻关闭，不是关住焦点。 |

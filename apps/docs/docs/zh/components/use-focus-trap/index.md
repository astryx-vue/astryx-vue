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

`useFocusTrap` 就像一个看不见的小管家，遵循 WAI-ARIA 规范，负责把键盘的光标焦点规整地关在指定的弹窗或容器里。

当弹窗打开并且焦点陷阱激活时，用户不断按下 Tab 键切换焦点，如果按到了容器里的最后一个按钮，再按 Tab 键就会悄悄绕回容器的第一个元素，焦点永远在弹窗内部循环，绝对不会不小心跳到背景网页上。打开陷阱时，它还会把光标焦点送进容器内部：优先定位到 `initialFocus` 指定的元素上，如果没有指定就会自动停留在第一个可以聚焦的元素上。

当弹窗关闭或陷阱解除时，它会把焦点原路还给刚才点开它的那个元素，确保键盘操作流程顺畅完整。焦点从没进过容器（比如焦点一直留在输入框上的下拉列表），或者已经被挪到别处时，就不还。用鼠标或手指关掉的，焦点回到触发器上但不画焦点环；用键盘关掉的照常画。

Tab 键只在焦点真的在容器里面时才会被拦下，浮层开着、焦点合理地留在外面时，整个页面照样能用 Tab。程序把初始焦点放在容器自己身上时，按 Tab 会进入里面的循环。输入法正在拼字时按的 Escape 是取消拼字，不会触发 `onEscape`。在容器外面用鼠标点击不会被拦截，方便实现点击遮罩空白处关闭弹窗。

**什么时候用：**
- 编写自定义的模态对话框（Modal）、抽屉（Drawer）等全屏遮罩浮层，需要限制键盘焦点不能跑到弹窗外面时。

**什么时候不要用：**
- 像 Tooltip（文字提示）、下拉菜单（DropdownMenu）这类普通的浮层，请不要把焦点强行关在里面；它们需要的是轻量的点击外部关闭，而不是把焦点牢牢锁死。
- 如果已经使用了官方的 [Dialog](/components/dialog) 或 [AlertDialog](/components/alert-dialog)，它们底层已经内置好了完备的焦点管理逻辑，无需再手动调用 `useFocusTrap`。

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

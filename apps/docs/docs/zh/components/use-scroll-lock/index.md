---
layout: component-docs
title: useScrollLock
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`isLocked` 为 true 的时候把 `body` 的滚动锁住，弹层后面的页面就停在原地不动。`isLocked` 是个 ref：把打开弹层的那个开关传进来，它自己跟着走。

这个锁按次数算。最外层的锁都放开，页面才真的松开，所以对话框里再叠一个抽屉，抽屉关掉不会把下面那层解锁。锁住之前 `body` 上原本的 `overflow` 会记下来，最后一层解开时写回去。滚动条是占地方的那种（Windows、Linux 桌面，或者 macOS 设成始终显示滚动条）时，锁住期间给它留住位置（`scrollbar-gutter: stable`，不支持的浏览器补 padding），页面和固定定位的元素都不会左右跳。作用域被清理掉的时候，它自己那一层也会放开。

```ts
import { useScrollLock } from '@astryx-vue/core'
import { ref } from 'vue'

const isOpen = ref(false)
useScrollLock(isOpen)
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 打开全屏的对话框或弹窗时用它，免得后面的内容跟着滚。 |
| <Badge variant="success">Do</Badge> | `isLocked` 传控制弹层开关的那个同一个 ref。 |
| <Badge variant="success">Do</Badge> | 调用放在拥有这个弹层的作用域里。作用域没了，锁也就放了。 |
| <Badge variant="error">Don't</Badge> | 拿它管气泡卡、提示这类非模态的浮层，那些东西应该允许用户滚开视线。 |

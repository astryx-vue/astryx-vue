---
layout: component-docs
title: useGridFocus
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

按 WAI-ARIA 的 grid 模式管二维网格里的键盘导航。方向键一格一格走，Home/End 走到当前行的首尾，Ctrl+Home/Ctrl+End 走到整张网格的首尾，Page Up/Down 交给调用方（日历里就是翻月）。走到边界时可以把事件交出去，让另一张网格接住焦点，例如翻到上个月后继续用方向键。

```ts
import { useGridFocus } from '@astryx-vue/core'
```

这个函数从 DOM 里读格子，所以 `gridRef` 和 `handleKeyDown` 挂在网格容器上。`handleFocus` 挂在容器的 `focusin` 上：DOM 里 `focus` 不冒泡，挂在容器的 `@focus` 上永远听不到格子的焦点。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在日历这种日期网格上：`onPageUp` / `onPageDown` 接翻月，`onNavigateBefore` / `onNavigateAfter` 接跨月继续用方向键。 |
| <Badge variant="success">推荐</Badge> | `gridRef` 和 `handleKeyDown` 都挂在网格容器上。 |
| <Badge variant="success">推荐</Badge> | 用 roving tabindex 的网格（例如日历）打开 `hasRovingTabIndex: true`，把 `handleFocus` 挂在容器的 `focusin` 上；先给一个目标元素写 `tabindex="0"`，函数会自己修正并移动它。 |
| <Badge variant="error">不要</Badge> | 用它做普通的一维列表；一维导航用 `useListFocus`。 |

---
layout: component-docs
title: useListFocus
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

管一维列表里的键盘导航，做法对齐 WAI-ARIA 的菜单、列表框和工具栏模式。方向键可以纵向、横向或两个方向都走；Home/End 到两头；可以选到头绕回；RTL 里左右对调；Escape 用来关闭。工具栏、分段控件、标签条这类「整组只有一个 Tab 停靠点」的组合控件，打开 `hasRovingTabIndex` 交给它管。下拉菜单、工具栏，以及任何一维的可聚焦列表都适用。

`listRef` 绑在容器上，`handleKeyDown` 绑容器的按键，`handleFocus` 绑容器的聚焦事件。`hasRovingTabIndex` 没开时 `handleFocus` 什么都不做，所以可以无脑绑上。

```ts
import { useListFocus } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 工具栏和标签条把 `orientation` 设成 `'horizontal'`，下拉菜单设成 `'vertical'`。 |
| <Badge variant="success">推荐</Badge> | 菜单和下拉菜单传 `onEscape`，在按下 Escape 时把焦点还给触发器。 |
| <Badge variant="success">推荐</Badge> | 工具栏式组合控件要成为单个 Tab 停靠点时，打开 `hasRovingTabIndex`；控件里可能有文本框时再打开 `hasCaretGuard`。 |
| <Badge variant="error">避免</Badge> | 用它做二维网格导航；网格和日历用 `useGridRovingFocus`。 |

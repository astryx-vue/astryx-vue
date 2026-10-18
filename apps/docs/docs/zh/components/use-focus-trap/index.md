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

按 WAI-ARIA 的对话框焦点陷阱做法，把焦点关在一个容器里。陷阱开着的时候会监听文档上的 `keydown`，Tab 和 Shift+Tab 到头就绕回另一头，焦点在容器里循环，走不出去。打开陷阱时也会把焦点送进去：优先用 `initialFocus` 返回的元素，没有就用第一个可聚焦元素。关掉就是全部拆卸，所以对话框只要切换这个 ref，不必卸载 hook。

焦点还回去不是陷阱的事，配合 `useRestoreFocus` 用，`Dialog` 和 `Popover` 就是这么做的。容器外面的鼠标点击也不拦，那是轻关闭要处理的。

```ts
import { useFocusTrap } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 容器用模板引用传进来；打开对话框或用例时调 `focusFirst()`，把焦点送进被关住的区域。 |
| <Badge variant="success">推荐</Badge> | 在陷阱旁边用 `useDismiss` 的 `onEscape` 处理 Escape 关闭；陷阱本身只管 Tab。 |
| <Badge variant="success">推荐</Badge> | 关闭后的焦点还原交给 `useRestoreFocus`；陷阱不会自己把焦点送回去。 |
| <Badge variant="success">推荐</Badge> | 用打开状态驱动 `isEnabled`，让陷阱只在浮层真的显示时生效。 |
| <Badge variant="error">避免</Badge> | 用在 Tooltip、下拉菜单这类非模态内容上；它们要的是轻关闭，不是关住焦点。 |

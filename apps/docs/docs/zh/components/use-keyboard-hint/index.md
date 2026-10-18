---
layout: component-docs
title: useKeyboardHint
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useKeyboardHintToolbar } from '../../../../components/demos/use-keyboard-hint'
</script>

## 使用方法

一组靠方向键移动的控件，第一次被键盘点进来时，在当前项旁边短暂提示一句「用方向键移动」。这是给看得见键盘用户的：告诉他方向键在这个组里能走。提示里的方向键用 `Kbd` 画，用 `fixed` 定位跟在当前项旁边，所以不会被滚动容器裁掉，并且是 `aria-hidden`。按过方向键、超时、或者焦点离开这个组，它都会自己关掉；关掉之后这个实例就不再提示。自己搭 roving-tabindex 控件时才会直接用到这个 hook；`Toolbar`、`TabList`、`SegmentedControl` 不会替你挂。

hook 返回的 `Hint` 组件要放在这一组容器里面，作为最后一个子元素。

```ts
import { useKeyboardHint } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 返回的 `onFocus` 和 `onKeyDown` 要和你自己的处理函数叠加，不要替换：先调 `onKeyDown`（它只负责收起提示，不会拦截），再调你的导航处理。 |
| <Badge variant="success">推荐</Badge> | `Hint` 渲染成这一组容器的最后一个子元素；它是 `fixed` 定位且 `aria-hidden`，所以不影响布局，也不进无障碍树。 |
| <Badge variant="success">推荐</Badge> | `orientation` 要和控件真正响应的方向一致，提示才会画对图标。 |
| <Badge variant="error">避免</Badge> | 用在单个控件，或者没有 roving-tabindex 导航的控件上；只有「方向键在一组里移动焦点」时这个提示才有意义。 |

## 示例

<DemoExample
  :demo="useKeyboardHintToolbar"
  description="自己搭的 roving-tabindex 工具栏，第一次被键盘聚焦时通过 useKeyboardHint 短暂提示方向键，让看得见的用户知道组里可以用方向键移动。"
  locale="zh"
  title="useKeyboardHint — 方向键提示"
/>

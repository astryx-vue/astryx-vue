---
layout: component-docs
title: usePopover
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { usePopoverQuickActions } from '../../../../components/demos/use-popover'
</script>

## 使用方法

点击触发、带焦点陷阱的浮层内核。它在 `useLayer` 之上叠加了 `useFocusTrap`、自动聚焦、点击外部关闭和 Escape 处理，做出「像对话一样」的无障碍弹出层。

```ts
import { usePopover } from '@astryx-vue/core/Popover'
```

把 `triggerRef` 绑到负责打开浮层的元素上：hook 会给它挂点击和键盘处理，并写好 `aria-haspopup`、`aria-expanded`、`aria-controls`。浮层自己渲染，把 `surfaceProps` 和 `contentStyle` 摊到浮层元素上：

```vue
<script setup lang="ts">
import { usePopover } from '@astryx-vue/core/Popover'

const popover = usePopover({ dialogLabel: 'Quick actions' })
</script>

<template>
  <button :ref="popover.triggerRef" type="button" @click="popover.toggle()">
    Open actions
  </button>
  <Teleport to="body">
    <div
      v-show="popover.isOpen"
      :ref="popover.contentRef"
      v-bind="popover.surfaceProps"
      :style="popover.contentStyle"
    >
      Actions
    </div>
  </Teleport>
</template>
```

`contentStyle` 里是量出来的坐标，浮层需要自己写 `position: fixed`。绘制出来的那层表面就是统一的 `popover` 目标。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 菜单、选择器、表单、命令面板这类需要管焦点的交互内容用它。 |
| <Badge variant="success">Do</Badge> | 标准的「触发器 + 内容」组合优先用 `Popover` 组件；触发器形态特殊时再用 hook。 |
| <Badge variant="success">Do</Badge> | 把 popover 当作宽泛的统一表面目标。 |
| <Badge variant="success">Do</Badge> | 自定义组合需要自己的主题细化时，传一个自己的 class（比如 `selector-popup`）并在文档里写明。它细化的是 popover 表面，不是另造一个解剖部件。 |
| <Badge variant="error">Don't</Badge> | 不要拿它做非交互的悬停预览：那种场景用 `useHoverCard` 或 `useTooltip`。 |

## 示例

用 `usePopover` 搭一个自定义的快速操作弹层，触发器 ref、ARIA 属性和焦点陷阱都由 hook 负责。

<DemoExample
  :demo="usePopoverQuickActions"
  description="用 usePopover 搭自定义快速操作弹层，触发器 ref、ARIA 属性和焦点陷阱都由 hook 负责。"
  locale="zh"
  title="usePopover — Quick Actions"
/>

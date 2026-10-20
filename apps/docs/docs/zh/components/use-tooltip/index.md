---
layout: component-docs
title: useTooltip
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useTooltipHookUsage } from '../../../../components/demos/use-tooltip'
</script>

## 使用方法

悬停 / 聚焦触发的文字提示。它在 `useLayer` 之上加了悬停意图、键盘焦点处理和 `aria-describedby` 关联。触发器形态特殊、不想套外壳组件时用它。

```ts
import { useTooltip } from '@astryx-vue/core/Tooltip'
```

把 `triggerRef` 绑到要用提示的元素上：hook 会挂指针和焦点事件，并把自己的 ID 追加到 `aria-describedby`（元素原有的 ID 保留）。气泡自己渲染，把 `contentProps` 摊上去：

```vue
<script setup lang="ts">
import { useTooltip } from '@astryx-vue/core/Tooltip'

const tooltip = useTooltip({ delay: 120 })
</script>

<template>
  <button :ref="tooltip.triggerRef" type="button">
    Hover me
  </button>
  <Teleport to="body">
    <div
      v-show="tooltip.isOpen"
      :ref="tooltip.contentRef"
      v-bind="tooltip.contentProps"
      :style="tooltip.contentStyle"
    >
      Helpful text
    </div>
  </Teleport>
</template>
```

`contentProps` 里有 `role="tooltip"`、ID，以及指针移入气泡时保持显示的处理函数。气泡的 `position: fixed` 由你自己写，`contentStyle` 只给量出来的坐标。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 图标按钮、被截断的文字、缩写、紧凑控件这类很短的文字说明用它。 |
| <Badge variant="success">Do</Badge> | 标准的包裹式用法优先用 `Tooltip` 组件；触发器不是简单子元素时再用 hook。 |
| <Badge variant="error">Don't</Badge> | 不要往提示里放交互内容：那种场景用 `Popover` 或 `HoverCard`。 |

## 示例

用 `useTooltip` 搭提示，开关完全由代码控制。

<DemoExample
  :demo="useTooltipHookUsage"
  description="用 useTooltip 搭提示，开关完全由代码控制。"
  locale="zh"
  title="Tooltip — Hook Usage"
/>

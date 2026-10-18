---
layout: component-docs
title: useHoverCard
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useHoverCardProfile } from '../../../../components/demos/use-hover-card'
</script>

## 使用方法

悬停触发的浮层卡片。它在 `useLayer` 之上加了悬停 / 焦点意图识别、可配置延迟、安全的悬停行为，以及 `aria-describedby` 关联。需要完全掌控触发器或卡片内容时用它。

```ts
import { useHoverCard } from '@astryx-vue/core/HoverCard'
```

把 `triggerRef` 绑到要弹卡片的元素上：hook 会挂指针、焦点和触摸处理，并让指针能移进卡片而不中途关闭。卡片自己渲染，把 `contentProps` 摊上去：

```vue
<script setup lang="ts">
import { useHoverCard } from '@astryx-vue/core/HoverCard'

const card = useHoverCard({ label: 'Alex Morgan' })
</script>

<template>
  <button :ref="card.triggerRef" type="button">
    Hover profile
  </button>
  <Teleport to="body">
    <div
      v-show="card.isOpen"
      :ref="card.contentRef"
      v-bind="card.contentProps"
      :style="card.contentStyle"
    >
      Alex Morgan
    </div>
  </Teleport>
</template>
```

给了 `label`，卡片就是有名字的 `role="dialog"`，触发器用 `aria-haspopup` / `aria-controls` / `aria-expanded` 宣告它；不给就退回 `role="group"`，走 `aria-describedby`。`contentProps` 里带着 role、label，以及保持卡片打开的处理函数。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 用户资料、实体摘要、链接预览这类富内容预览用它。 |
| <Badge variant="success">Do</Badge> | 标准的「触发器 + 内容」组合优先用 `HoverCard` 组件；触发器形态特殊时再用 hook。 |
| <Badge variant="error">Don't</Badge> | 简单文字提示不要用它：那种场景用 `Tooltip` 或 `useTooltip`。 |

## 示例

用 `useHoverCard` 搭一个自定义的资料卡预览，触发器和卡片内容都自己掌控。

<DemoExample
  :demo="useHoverCardProfile"
  description="用 useHoverCard 搭自定义资料卡预览，触发器和内容渲染都自己掌控。"
  locale="zh"
  title="useHoverCard — Profile Preview"
/>

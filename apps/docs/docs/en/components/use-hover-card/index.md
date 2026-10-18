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

## Usage

Headless hook for hover-triggered floating cards. Builds on `useLayer` with hover/focus intent detection, configurable delays, safe hover behavior, and accessible `aria-describedby` linking. Use for rich previews on hover when you need full control over the trigger or rendered content.

```ts
import { useHoverCard } from '@astryx-vue/core/HoverCard'
```

Bind `triggerRef` to the element that reveals the card. The hook attaches the pointer, focus, and touch handlers and keeps the card open while the pointer travels into it. Render the surface yourself and spread `contentProps` on it:

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

With a `label` the card is exposed as a named `role="dialog"` and the trigger advertises it with `aria-haspopup` / `aria-controls` / `aria-expanded`. Without one it falls back to `role="group"` and an `aria-describedby` link. `contentProps` carries the role, the label, and the handlers that keep the card open.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for rich content previews such as user profiles, entity summaries, and link previews. |
| <Badge variant="success">Do</Badge> | Prefer the `HoverCard` component for standard trigger-content pairs; use the hook for custom trigger patterns. |
| <Badge variant="error">Don't</Badge> | Use for simple text hints: use `Tooltip` or `useTooltip` instead. |

## Examples

Custom profile preview built with `useHoverCard`, with direct control over the trigger and the rendered content.

<DemoExample
  :demo="useHoverCardProfile"
  description="Custom profile preview using useHoverCard with direct trigger and render control."
  locale="en"
  title="useHoverCard — Profile Preview"
/>

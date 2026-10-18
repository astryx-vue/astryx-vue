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

## Usage

Headless hook for click-triggered popovers with focus trapping. Combines `useLayer` with `useFocusTrap`, auto-focus, light dismiss, and Escape handling for accessible dialog-like popover behavior.

```ts
import { usePopover } from '@astryx-vue/core/Popover'
```

Bind `triggerRef` to the element that should open the popover. The hook attaches the click and keyboard handlers and writes `aria-haspopup`, `aria-expanded`, and `aria-controls` on that element. Render the surface yourself and spread `surfaceProps` and `contentStyle` on it:

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

`contentStyle` carries the measured coordinates. Give the surface `position: fixed` in your own CSS. Every painted surface is the canonical `popover` target.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for interactive content such as menus, pickers, forms, and command panels that need focus management. |
| <Badge variant="success">Do</Badge> | Prefer the `Popover` component for standard trigger-content pairs; use the hook for custom trigger patterns. |
| <Badge variant="success">Do</Badge> | Use popover as the broad canonical surface target. |
| <Badge variant="success">Do</Badge> | When a custom composition needs its own theme refinement, pass and document an owned class such as `selector-popup`. It refines the popover surface rather than creating another anatomy part. |
| <Badge variant="error">Don't</Badge> | Use for non-interactive hover previews: use `useHoverCard` or `useTooltip` instead. |

## Examples

Custom quick-actions popover built with `usePopover` for trigger refs, ARIA attributes, and focus trapping.

<DemoExample
  :demo="usePopoverQuickActions"
  description="Custom quick-actions popover using usePopover for trigger refs, ARIA attributes, and focus trapping."
  locale="en"
  title="usePopover — Quick Actions"
/>

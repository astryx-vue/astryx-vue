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

## Usage

Headless hook for hover/focus-triggered tooltips. Builds on `useLayer` with hover intent, keyboard focus handling, and accessible `aria-describedby` linking. Use for custom trigger elements that need tooltip behavior without the wrapper component.

```ts
import { useTooltip } from '@astryx-vue/core/Tooltip'
```

Bind `triggerRef` to the element that owns the tooltip. The hook attaches the pointer and focus handlers and appends its ID to `aria-describedby`, keeping whatever the element already had. Render the bubble yourself and spread `contentProps` on it:

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

`contentProps` carries `role="tooltip"`, the ID, and the pointer handlers that keep the bubble open while the pointer is inside it. Give the bubble `position: fixed` in your own CSS; `contentStyle` only supplies the measured coordinates.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for brief text labels that describe icon buttons, truncated text, abbreviations, or compact controls. |
| <Badge variant="success">Do</Badge> | Prefer the `Tooltip` component for standard wrapping; use the hook when the trigger is not a simple child. |
| <Badge variant="error">Don't</Badge> | Put interactive content inside tooltips: use `Popover` or `HoverCard` instead. |

## Examples

Tooltip built with the `useTooltip` hook for programmatic control.

<DemoExample
  :demo="useTooltipHookUsage"
  description="Tooltip using the useTooltip hook for programmatic control."
  locale="en"
  title="Tooltip — Hook Usage"
/>

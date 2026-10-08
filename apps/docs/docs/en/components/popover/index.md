---
layout: component-docs
title: Popover
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { popoverActions, popoverBasic, popoverForm, popoverPlacements } from '../../../../components/demos/popover'
</script>

## Usage

`Popover` opens a surface next to a trigger button. The surface holds short, interactive content such as a form, a short message, or an action list. The trigger is the default slot and the surface is the `content` slot.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
</script>

<template>
  <Popover label="Project details">
    <Button label="Details" variant="secondary" />
    <template #content>
      <p>Short content goes here.</p>
    </template>
  </Popover>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep popover content focused on a single task or piece of information. |
| <Badge variant="success">Do</Badge> | Provide a clear way to close: either by clicking outside or with an explicit close button. |
| <Badge variant="error">Don't</Badge> | Nest popovers inside other popovers; it creates confusing focus and navigation. |
| <Badge variant="error">Don't</Badge> | Use a popover for content that requires heavy user input; use a Dialog instead. |
| <Badge variant="error">Don't</Badge> | Put too much content in a popover; if it needs scrolling, use a Dialog instead. |

## Examples

<DemoExample :demo="popoverBasic" title="Basic" description="Click the trigger to open the surface. Escape, an outside press, or the close button dismisses it." locale="en" />

<DemoExample :demo="popoverPlacements" title="Placements" description="placement sets the side of the trigger and alignment sets its position along that side. The popover flips when there is no room." locale="en" />

<DemoExample :demo="popoverForm" title="Form content" description="A dialog popover holds interactive controls. Focus moves into it when it opens and returns to the trigger when it closes." locale="en" />

<DemoExample :demo="popoverActions" title="Action list" description="role none removes dialog semantics for content that already carries its own roles, such as a menu. Focus stays on the trigger." locale="en" />

## Accessibility

- The trigger receives `aria-haspopup`, `aria-expanded`, and `aria-controls`.
- A `dialog` surface has `role="dialog"`, `aria-modal="true"` when `isModal` is set, and the `label` as its accessible name.
- Focus moves to the first focusable element on open and returns to the trigger on Escape or close.
- `isModal` keeps Tab focus inside the surface while it is open.
- The built-in close button is visually hidden until it receives focus.

## Layout

The surface is positioned with JavaScript. It recalculates its position when the page scrolls or resizes, and it flips to the other side when the chosen side has no room.

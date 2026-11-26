---
layout: component-docs
title: Popover
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { popoverBottomSheet, popoverConfirm, popoverFilter, popoverSettings, popoverShortcuts } from '../../../../components/demos/popover'
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





<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep popover content focused on a single task or piece of information. |
| <Badge variant="success">Do</Badge> | Provide a clear way to close: either by clicking outside or with an explicit close button. |
| <Badge variant="error">Don't</Badge> | Nest popovers inside other popovers; it creates confusing focus and navigation. |
| <Badge variant="error">Don't</Badge> | Use a popover for content that requires heavy user input; use a Dialog instead. |
| <Badge variant="error">Don't</Badge> | Put too much content in a popover; if it needs scrolling, use a Dialog instead. |

## Examples

<DemoExample :demo="popoverBottomSheet" title="Adaptive presentation" description="With presentation set to adaptive, project actions open in a bottom sheet on a phone and stay anchored to the button everywhere else." locale="en" />

<DemoExample :demo="popoverConfirm" title="Confirm action" description="A destructive button opens a short confirmation with Delete and Cancel." locale="en" />

<DemoExample :demo="popoverFilter" title="Filter panel" description="Status checkboxes with Apply and Reset." locale="en" />

<DemoExample :demo="popoverShortcuts" title="Keyboard shortcuts" description="A list of shortcut keys and what they do." locale="en" />

<DemoExample :demo="popoverSettings" title="Settings panel" description="Switches for notifications, dark mode, and sounds." locale="en" />

## Accessibility

A popover has to communicate its presence, its current open state, and its content to people who use a screen reader or a keyboard. The component links the trigger to the surface automatically and manages focus as the surface opens and closes, so you only need to supply the accessible name.

- The trigger receives `aria-haspopup` and `aria-expanded`, so assistive technology knows it is a button that opens a surface and can announce whether that surface is currently expanded. While the surface is open it also gets `aria-controls`; a closed trigger points at nothing.
- An open `dialog` surface has `role="dialog"`; when `isModal` is set it also has `aria-modal="true"`, and the `label` serves as its accessible name. The closed surface stays in the DOM, hidden, without the dialog role or name.
- A trigger with `aria-disabled="true"` stays focusable but opens nothing, even for a click dispatched on it.
- On open, focus moves to the first enabled tab stop inside the surface: controls with `aria-disabled` are skipped, and in a roving group the member with `tabindex="0"` wins. With nothing to take it, the labelled surface does. Focus that is already on a control inside stays there.
- On close, focus returns only when it is stuck inside the surface or on the page body. It goes to the element that opened the popover; if that is gone, to the trigger, the anchor, the tab stop that took the opener's place, a nearby ancestor, then `main`. It never lands on the body, and focus already outside the surface is left alone.
- With `isModal` set, Tab focus stays inside the surface while it is open.
- The built-in close button is visually hidden until it receives focus, so it appears once the keyboard reaches it.
- In a bottom sheet (`presentation`), the trigger points at the sheet with `aria-controls` and reports its open state. Each opening moves focus to the first content control, never the close button. When the sheet closes, focus returns to the trigger.

## Layout

The surface is positioned with JavaScript. It recalculates its position when the page scrolls or resizes, and it flips to the other side when the chosen side has no room. The entrance slides in from the side the surface actually lands on and grows from the edge that faces the trigger, never travelling further than the gap between them, so a flipped surface never starts over its trigger.

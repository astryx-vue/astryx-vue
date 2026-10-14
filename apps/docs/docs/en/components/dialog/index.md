---
layout: component-docs
title: Dialog
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dialogAdaptive, dialogConfirmation, dialogForm, dialogFullscreen, dialogRequired, dialogScrollable } from '../../../../components/demos/dialog'
</script>

## Usage

`Dialog` presents one modal task above the page. It uses the native `<dialog>` element, so it traps focus, locks the page behind a backdrop, and returns focus to the element that opened it. Pair it with `DialogHeader` to get a focusable title, an optional subtitle, and a close button.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="Share project" variant="secondary" @click="isOpen = true" />
  <Dialog :is-open="isOpen" @open-change="isOpen = $event">
    <DialogHeader title="Share project" has-close-button @open-change="isOpen = $event" />
    <p>Copy the link and send it to your team.</p>
  </Dialog>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Choose the right purpose: info for dismissable content, form to prevent accidental backdrop dismissal, required when the user must respond. |
| <Badge variant="success">Do</Badge> | Include a clear title in the header so users immediately understand what the dialog is asking. |
| <Badge variant="success">Do</Badge> | Use purpose="form" for dialogs with inputs so the user can't accidentally lose data by clicking the backdrop. |
| <Badge variant="success">Do</Badge> | Keep dialogs focused on a single task; if the content grows beyond what fits, consider a full page instead. |
| <Badge variant="error">Don't</Badge> | Use a dialog for simple messages that could be shown inline or as a toast notification. |
| <Badge variant="error">Don't</Badge> | Nest dialogs inside other dialogs; restructure the flow into steps within a single dialog instead. |
| <Badge variant="error">Don't</Badge> | Use the fullscreen variant for simple confirmations; it is meant for complex content like editors or long forms. |

## Examples

<DemoExample :demo="dialogAdaptive" title="Adaptive presentation" description="Dialog stays the default. On a coarse pointer at lg and below, the same profile form opens as a bottom sheet." locale="en" />

<DemoExample :demo="dialogConfirmation" title="Confirmation" description="Asks before a destructive action. The inline preview stays on the page; its buttons open the real dialog." locale="en" />

<DemoExample :demo="dialogForm" title="Form" description="Collects a name and bio without leaving the page. purpose form keeps Escape and ignores backdrop clicks." locale="en" />

<DemoExample :demo="dialogFullscreen" title="Fullscreen" description="variant fullscreen fills the viewport for documentation and other long reading." locale="en" />

<DemoExample :demo="dialogScrollable" title="Scrollable" description="maxHeight keeps the dialog short and scrolls the terms inside it." locale="en" />

<DemoExample :demo="dialogRequired" title="Required" description="purpose required blocks Escape and the backdrop. The user has to choose Cancel or Transfer." locale="en" />

## Accessibility

`Dialog` is built on the native `<dialog>` element, so the modal behavior, the focus trap, and the focus handoff on close all come from the browser rather than from extra configuration.

The dialog is shown with `showModal()`, which makes the rest of the page inert while it is open. When it opens, initial focus goes to the first element with `data-autofocus`; if no element has that attribute, focus goes to the `DialogHeader` title.

The dialog takes its name from the `DialogHeader` title, which the component associates with the dialog through `aria-labelledby`. An explicit `aria-label` or `aria-labelledby` replaces that name with the one you provide.

Escape and backdrop clicks do not close the dialog directly. They emit `openChange(false)`, and the parent decides whether to close. When the dialog closes, focus returns to the element that was focused when it opened, as long as that element is still in the page.

## Limitations

Two constraints shape what you can put inside a dialog, and both are worth knowing before you combine it with other components.

- Tooltip and Popover render into `body`. Inside an open `Dialog` they sit beneath the modal top layer, so they cannot be seen or used. Do not nest them inside a dialog until they are moved into the dialog's own layer.
- Dialogs cannot be nested. If a flow needs several steps, restructure it as steps within a single dialog rather than opening a second one.

## Layout

The standard variant sizes itself with `width` and `maxHeight`, and clamps to the viewport with spacing gutters on narrow screens. `position` places it at a static offset. Logical `start` and `end` offsets mirror under RTL.

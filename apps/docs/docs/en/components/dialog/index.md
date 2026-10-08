---
layout: component-docs
title: Dialog
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dialogBasic, dialogForm, dialogFullscreen, dialogImperative, dialogRequired } from '../../../../components/demos/dialog'
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

<DemoExample :demo="dialogBasic" title="Basic" description="A header with a subtitle and close button. The title receives focus when the dialog opens." locale="en" />

<DemoExample :demo="dialogForm" title="Form" description="purpose form allows Escape but ignores backdrop clicks, so typed input is not lost by accident." locale="en" />

<DemoExample :demo="dialogRequired" title="Required" description="purpose required disables Escape and backdrop dismissal. The dialog uses alertdialog semantics for decisions the user must make." locale="en" />

<DemoExample :demo="dialogFullscreen" title="Fullscreen" description="variant fullscreen fills the viewport for long editing tasks and respects safe-area insets." locale="en" />

<DemoExample :demo="dialogImperative" title="Imperative" description="useImperativeDialog opens content without managing isOpen. Render its Host once in the template." locale="en" />

## Accessibility

- The dialog is shown with `showModal()`, so the rest of the page is inert while it is open.
- Initial focus goes to the first element with `data-autofocus`. If none exists, it goes to the `DialogHeader` title.
- The dialog is named by the `DialogHeader` title. An explicit `aria-label` or `aria-labelledby` replaces that name.
- Escape and backdrop clicks emit `openChange(false)`. The parent decides whether to close.
- Closing returns focus to the element that was focused when the dialog opened, when it is still in the page.

## Limitations

- Tooltip and Popover render into `body`. Inside an open `Dialog` they sit beneath the modal top layer and cannot be seen or used. Do not nest them inside a dialog until they are moved into the dialog's own layer.
- Dialogs cannot be nested. Restructure the flow into steps within one dialog.

## Layout

The standard variant sizes itself with `width` and `maxHeight`, and clamps to the viewport with spacing gutters on narrow screens. `position` places it at a static offset. Logical `start` and `end` offsets mirror under RTL.

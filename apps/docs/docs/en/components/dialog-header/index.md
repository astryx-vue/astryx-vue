---
layout: component-docs
title: Dialog Header
outline: false
footer: false
---

<script setup lang="ts">
import { dialogHeaderBasic } from '../../../../components/demos/dialog-header'
import { DialogHeader } from '@astryx-vue/core/Dialog'
</script>

## Usage

`DialogHeader` gives a dialog a labelled title area and an optional close control. It reads context from the parent `Dialog`: the title becomes the dialog's accessible name, and focus lands on it when the dialog opens.

`title` is required. A subtitle is skipped when it is an empty string. The close button only appears when you pass `hasCloseButton`; clicking it emits `openChange(false)` and the parent decides whether to close.

```vue
<script setup lang="ts">
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Dialog :is-open="isOpen" @open-change="isOpen = $event">
    <DialogHeader
      title="Edit profile"
      subtitle="Update your personal information"
      has-close-button
      @open-change="isOpen = $event"
    />
    <p>Dialog body content goes here.</p>
  </Dialog>
</template>
```

Without a parent `Dialog`, the title is not associated with any dialog and the close button does not take part in the dialog's default focus behaviour. Render it inside the default slot of `Dialog`.

<ComponentAnatomy />

## Examples

<DemoExample :demo="dialogHeaderBasic" title="Basic" description="A title, subtitle, and close button inside the default slot of Dialog. The close button renders only when hasCloseButton is passed." locale="en" />

## Accessibility

The title is exposed as a heading through `role="heading"` and `aria-level="2"`, and it labels the parent dialog through `aria-labelledby`. A screen reader announces the dialog by its title text.

When the dialog opens, the title carries `tabindex="-1"` and receives initial focus, so keyboard users hear the name right away instead of starting in the middle of the body.

The close control is an `IconButton`. When `closeButtonLabel` is omitted, its accessible name follows the active language: Close in English, 关闭 in Chinese.

The `title` and `subtitle` slots take inline content, such as emphasis or a link. An empty subtitle string with no slot renders nothing.

Theme targets are `dialog-header`, `dialog-header-start-content`, `dialog-header-title-block`, `dialog-header-end-content`, and `dialog-header-close-icon`. They sit on the row, the leading slot, the title block, the trailing slot, and the close glyph. With a close button, the trailing slot pulls in on the block edges and the inline end, cancelling the button's own padding. `endContentEdgeCompensation` selects `inline`, `block`, or `all`.

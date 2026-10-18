---
layout: component-docs
title: useImperativeDialog
outline: false
footer: false
---

<script setup lang="ts">
import {
  useImperativeDialogConfirmation,
  useImperativeDialogForm,
  useImperativeDialogRequired,
  useImperativeDialogScrollable,
} from '../../../../components/demos/use-imperative-dialog'
</script>

## Usage

Hook for showing a dialog without managing open state. Call `dialog.show(content, options)` to open and `dialog.hide()` to close. Render `dialog.Host` once in your template.

```ts
import { useImperativeDialog } from '@astryx-vue/core/Dialog'
```

```vue
<script setup lang="ts">
import { DialogHeader, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'

const dialog = useImperativeDialog({ width: 400 })
const DialogHost = dialog.Host

function askToDelete(): void {
  dialog.show(
    () => h(DialogHeader, { title: 'Delete project?', hasCloseButton: true }),
    { purpose: 'form' },
  )
}
</script>

<template>
  <button type="button" @click="askToDelete">
    Delete project
  </button>
  <DialogHost />
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useImperativeDialogConfirmation"
  description="Asks the user to confirm a destructive action before it happens. Use before deleting projects, removing team members, revoking API keys, or any irreversible operation."
  locale="en"
  title="Dialog — Confirmation"
/>

<DemoExample
  :demo="useImperativeDialogForm"
  description="Collects user input without navigating away from the page. Uses purpose form so clicking the backdrop won't close it. Use for editing profiles, creating items, or updating settings inline."
  locale="en"
  title="Dialog — Form"
/>

<DemoExample
  :demo="useImperativeDialogRequired"
  description="Cannot be dismissed by Escape or backdrop click; the user must explicitly choose an action. Uses purpose required. Use for ownership transfers, legal acknowledgements, or critical decisions where skipping is not an option."
  locale="en"
  title="Dialog — Required"
/>

<DemoExample
  :demo="useImperativeDialogScrollable"
  description="Constrains the dialog height and scrolls the body when content overflows. Use for terms and conditions, license agreements, changelogs, or any long-form content the user needs to review before accepting."
  locale="en"
  title="Dialog — Scrollable"
/>

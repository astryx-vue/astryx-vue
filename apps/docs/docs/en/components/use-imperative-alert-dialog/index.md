---
layout: component-docs
title: useImperativeAlertDialog
outline: false
footer: false
---

<script setup lang="ts">
import { useImperativeAlertDialogDelete } from '../../../../components/demos/use-imperative-alert-dialog'
</script>

## Usage

Hook for showing an alert dialog without managing open state. Call `alert.show(options)` to open and `alert.hide()` to close. Render `alert.Host` once in your template.

```ts
import { useImperativeAlertDialog } from '@astryx-vue/core/AlertDialog'
```

```vue
<script setup lang="ts">
import { useImperativeAlertDialog } from '@astryx-vue/core/AlertDialog'

const alert = useImperativeAlertDialog()
const AlertHost = alert.Host

function askToDelete(): void {
  alert.show({
    title: 'Delete item?',
    description: 'This action cannot be undone.',
    actionLabel: 'Delete',
    onAction: () => alert.hide(),
  })
}
</script>

<template>
  <button type="button" @click="askToDelete">
    Delete item
  </button>
  <AlertHost />
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useImperativeAlertDialogDelete"
  description="A delete button that asks the user to confirm before deleting."
  locale="en"
  title="useImperativeAlertDialog — Delete"
/>

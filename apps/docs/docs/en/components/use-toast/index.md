---
layout: component-docs
title: useToast
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useToastShow } from '../../../../components/demos/use-toast'
</script>

## Usage

Hook for showing toast notifications from anywhere in your component tree. Returns a function that accepts toast options and shows the notification. Toasts live in a module-level store, so the hook works in any component; render `ToastViewport` once to give them a place to appear. `LayerProvider` only supplies the viewport's placement and visible limit.

```ts
import { useToast } from '@astryx-vue/core/Toast'
```

```vue
<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <button type="button" @click="toast({ body: 'Document saved successfully', type: 'success' })">
    Show toast
  </button>
  <ToastViewport />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for transient success/error feedback that does not require user action. |
| <Badge variant="success">Do</Badge> | Set `uniqueID` to deduplicate toasts from rapid user actions. |
| <Badge variant="success">Do</Badge> | Render `ToastViewport` once near the app root, so every toast has a place to appear. |
| <Badge variant="error">Don't</Badge> | Use for critical errors that require acknowledgment; use `AlertDialog` instead. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useToastShow"
  description="Imperative toast notifications triggered with useToast and rendered in the toast viewport."
  locale="en"
  title="useToast — Show Toast"
/>

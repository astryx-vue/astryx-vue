---
layout: component-docs
title: Toast
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toastAction, toastDedup, toastDismiss, toastStacking, toastTypes } from '../../../../components/demos/toast'
</script>

## Usage

Place `ToastViewport` once near the root of your app, then call `useToast` from any component.

On a touch screen, a swipe toward the toast's edge dismisses it: down when it sits at the bottom, up when it sits at the top. A horizontal drag is left to the page. A swipe that starts on a button or link does not dismiss. A mouse drag does not dismiss either.

```vue
<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

toast({ body: 'Saved successfully', type: 'success' })
</script>

<template>
  <div>
    <button @click="toast({ body: 'Saved' })">
      Save
    </button>
    <ToastViewport />
  </div>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Put `ToastViewport` at the top level so toasts overlay every page. |
| <Badge variant="success">Recommended</Badge> | Use `type="error"` for failures and rely on `role="alert"`. |
| <Badge variant="success">Recommended</Badge> | Keep toast copy short — one line describing the outcome is enough. |
| <Badge variant="error">Don't</Badge> | Flood the screen with many toasts at once. |
| <Badge variant="error">Don't</Badge> | Use toasts for actions that need user confirmation. |

## Examples

<DemoExample
  :demo="toastAction"
  description="A persistent toast can end with a button or a link, for undoing a delete or opening a report."
  locale="en"
  title="Action"
/>

<DemoExample
  :demo="toastDedup"
  description="uniqueID collapses repeats. ignore keeps the first toast; overwrite replaces it, for a progress percentage."
  locale="en"
  title="Deduplication"
/>

<DemoExample
  :demo="toastDismiss"
  description="useToast returns a function that dismisses that toast. Use it when a long-running operation should close the notice itself."
  locale="en"
  title="Dismiss"
/>

<DemoExample
  :demo="toastStacking"
  description="Toasts stack vertically and animate in and out. Clicking again queues another one."
  locale="en"
  title="Stacking"
/>

<DemoExample
  :demo="toastTypes"
  description="Info and error side by side. Info goes away on its own; error stays until it is dismissed."
  locale="en"
  title="Types"
/>

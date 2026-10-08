---
layout: component-docs
title: Toast
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toastBasic, toastStack } from '../../../../components/demos/toast'
</script>

## Usage

Place `ToastViewport` once near the root of your app, then call `useToast` from any component.

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
  :demo="toastBasic"
  description="Click the buttons to trigger toasts of different types and durations."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="toastStack"
  description="Several toasts stack in the viewport and keep their order as they appear."
  locale="en"
  title="Stack"
/>

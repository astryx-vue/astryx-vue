---
layout: component-docs
title: Field Status
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { fieldStatusBasic } from '../../../../components/demos/field-status'
</script>

## Usage

`FieldStatus` is the message already used inside `Field`. Import it on its own when a custom control needs the same error, warning, or success treatment.

```vue
<script setup lang="ts">
import { FieldStatus } from '@astryx-vue/core/FieldStatus'
</script>

<template>
  <FieldStatus type="error" message="This field is required" variant="detached" />
</template>
```

`attached` tucks the message under a bordered control. `detached` is a separate block, which is what a standalone message should use. An error is announced assertively. Warning and success are polite. The component does not invent new behavior beyond `Field`.


<ComponentAnatomy />

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `detached` when the message is not attached to an input shell. |
| <Badge variant="success">Do</Badge> | On a repeated failed submit with unchanged errors, announce once from the form with `useAnnounce`, for example `announce(`${errors.length} errors. ${errors[0]}`, 'assertive')`, and move focus to the first invalid field. A status is announced when it first appears and when its message or type changes, so on a first failed submit the fields announce their own errors and the form adds nothing. |
| <Badge variant="error">Don't</Badge> | Build a second status style. This is the one the fields already use. |

## Examples

<DemoExample :demo="fieldStatusBasic" description="A detached error and a detached success." locale="en" title="Basic" />

---
layout: component-docs
title: Form Layout
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { formLayoutHorizontal, formLayoutHorizontalLabels, formLayoutMixed, formLayoutNested } from '../../../../components/demos/form-layout'
</script>

## Usage

`FormLayout` arranges fields. It is not a `<form>`. Put the fields in the default slot and choose a direction.

```vue
<script setup lang="ts">
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { TextInput } from '@astryx-vue/core/TextInput'
</script>

<template>
  <FormLayout>
    <TextInput v-model="name" label="Name" />
    <TextInput v-model="email" label="Email" />
  </FormLayout>
</template>
```

`direction` is `vertical` (the default), `horizontal`, or `horizontal-labels`. Vertical stacks fields with a gap of spacing step 4. Horizontal places them in equal columns. Horizontal labels put the label on the left and the control on the right, and collapse to a column below 480px.

`defaultOptionality` is `optional` or `required`. It changes the indicator and `aria-required` on fields that do not set their own `isOptional` or `isRequired`. It does not set the native `required` attribute. When a field sets both, optional wins. Outside a `FormLayout`, `aria-required` stays `isRequired && !isOptional`.

Nested layouts keep their own direction. A horizontal row can sit inside a vertical form.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use horizontal for a short row of related fields, such as a first and last name. |
| <Badge variant="success">Do</Badge> | Use horizontal-labels when every field has a label and the form is wider than a phone. |
| <Badge variant="error">Don't</Badge> | Put an unrelated control, such as a page title, in the layout. It participates in the grid. |
| <Badge variant="error">Don't</Badge> | Expect `defaultOptionality` to block submit. It only sets the indicator and `aria-required`. |

## Examples

<DemoExample :demo="formLayoutHorizontal" description="Two fields sit side by side for a pair such as first and last name." locale="en" title="Horizontal" />

<DemoExample :demo="formLayoutHorizontalLabels" description="A settings form places each label beside its input." locale="en" title="Settings form" />

<DemoExample :demo="formLayoutMixed" description="One form mixes a text input, a selector, and checkboxes." locale="en" title="Mixed controls" />

<DemoExample :demo="formLayoutNested" description="An address form mixes a vertical stack with horizontal rows for grouped fields." locale="en" title="Nested address" />

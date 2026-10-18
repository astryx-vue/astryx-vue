---
layout: component-docs
title: Field Label
outline: false
footer: false
---

<script setup lang="ts">
import { fieldLabelBasic } from '../../../../components/demos/field-label'
</script>

## Usage

Standalone label component with optional/required indicators and tooltip support.

`FieldLabel` is the label half of `Field`. Use it directly when the control it names does not render a label of its own: a custom widget, a group of inputs, or a wrapper built outside this library. `label` and `input-id` are both required; the id is what makes the label point at the control.

```vue
<script setup lang="ts">
import { FieldLabel } from '@astryx-vue/core/Field'
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <div>
    <FieldLabel label="Email address" input-id="email-input" is-required />
    <input id="email-input" v-model="email" type="email">
  </div>
</template>
```

`isRequired` and `isOptional` print the "Required" or "Optional" marker next to the label. Inside a `FormLayout` with a `defaultOptionality`, only the exception gets marked, so a required-by-default form does not need the marker on every field. `description` adds a supporting line under the label that also focuses the control when it is clicked. `labelIcon` puts a small glyph before the label text, and `labelTooltip` adds an info button whose text a screen reader can reach.

Set `isGroupLabel` when the labelled thing is a group of controls rather than one input. The label then renders as a `span` instead of a `label`, so a click on it does not get handed to whichever control happens to sit first.

```ts
import { FieldLabel } from '@astryx-vue/core/Field'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="fieldLabelBasic" title="Basic" description="Standalone labels with required and optional indicators and a helper description. Use when labeling a custom control that does not render its own label." locale="en" />

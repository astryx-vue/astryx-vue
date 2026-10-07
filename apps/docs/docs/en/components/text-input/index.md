---
layout: component-docs
title: Text Input
outline: false
footer: false
---

<script setup lang="ts">
import { textInputBasic, textInputSizes, textInputSearch, textInputPassword, textInputStates, textInputValidation, textInputAsync } from '../../../../components/demos/text-input'
</script>

## Usage

`TextInput` accepts single-line text. The component includes `Field`.

```vue
<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const email = shallowRef('')
</script>

<template>
  <TextInput v-model="email" label="Email" type="email" auto-complete="email" />
</template>
```

For a custom control, use [Field](/en/components/field). Import the theme once in your app entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

## Examples

<DemoExample :demo="textInputBasic" title="Basic input" description="Keep the label, description and value together, with v-model owning the value." locale="en" />

<DemoExample :demo="textInputSizes" title="Sizes" description="Three sizes match Button. Labels and descriptions keep their own type scale." locale="en" />

<DemoExample :demo="textInputSearch" title="Search and clear" description="Hidden labels retain their accessible name. Committing an IME candidate does not emit enter." locale="en" />

<DemoExample :demo="textInputPassword" title="Password and end slot" description="Add a reveal button through the end slot while retaining native password behavior." locale="en" />

<DemoExample :demo="textInputStates" title="Disabled and read-only" description="Disabled fields do not submit. Read-only fields remain focusable, copyable and submittable. A disabled reason stays focus-discoverable." locale="en" />

<DemoExample :demo="textInputValidation" title="Validation states" description="Every status has a glyph. Messages can be attached, detached or shown in a tooltip." locale="en" />

<DemoExample :demo="textInputAsync" title="Async saving and retry" description="Edits drive pending state. Enter fail to see a failure, then edit to retry. The example ignores stale request results." locale="en" />

## Accessibility

- Provide `label`.
- Do not use `placeholder` instead of a label.
- `description` connects to `aria-describedby`.
- `status.message` connects to `aria-describedby`.
- Error status sets `aria-invalid`.
- Required status sets `aria-required`.

For native browser validation, also pass `required`.
`isRequired` controls the required indicator and ARIA state.

## Input methods

- During input method composition, the component does not update `v-model`.
- After `compositionend`, the component updates `v-model`.
- Enter used to confirm a composition candidate does not emit `enter`.

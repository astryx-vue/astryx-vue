---
layout: component-docs
title: Text Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon. |
| <Badge variant="success">Do</Badge> | Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red. |
| <Badge variant="success">Do</Badge> | Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs. |
| <Badge variant="success">Do</Badge> | Add a clear button for search and filter inputs so users can quickly reset without selecting all text. |

## Examples

<DemoExample :demo="textInputBasic" title="Basic input" description="Keep the label, description and value together, with v-model owning the value." locale="en" />

<DemoExample :demo="textInputSizes" title="Sizes" description="Three sizes match Button. Labels and descriptions keep their own type scale." locale="en" />

<DemoExample :demo="textInputSearch" title="Search and clear" description="Hidden labels retain their accessible name. Committing an IME candidate does not emit enter." locale="en" />

<DemoExample :demo="textInputPassword" title="Password and end slot" description="Add a reveal button through the end slot while retaining native password behavior." locale="en" />

<DemoExample :demo="textInputStates" title="Disabled and read-only" description="Disabled fields do not submit. Read-only fields remain focusable, copyable and submittable. A disabled reason stays focus-discoverable." locale="en" />

<DemoExample :demo="textInputValidation" title="Validation states" description="Every status has a glyph. Messages can be attached, detached or shown in a tooltip." locale="en" />

<DemoExample :demo="textInputAsync" title="Async saving and retry" description="Edits drive pending state. Enter fail to see a failure, then edit to retry. The example ignores stale request results." locale="en" />

## Accessibility

A `label` is required. Screen readers rely on it to describe what the field is for, and a `placeholder` is only visible while the field is empty, so it cannot stand in for a label.

The component wires the label, description and status message together with ARIA attributes, so assistive technology reads them as one unit:

- `description` and `status.message` connect to `aria-describedby`.
- An error status sets `aria-invalid`.
- A required field sets `aria-required`.

`isRequired` renders the required indicator and sets the ARIA state. When you also need native browser validation — for example when you rely on form submission to block an incomplete field — pass `required` as well.

## Input methods

While an input method such as Pinyin or Kana is composing a candidate, the characters the user has typed are not final yet. The component tracks that distinction so a half-finished value never reaches your state:

- The component does not update `v-model` while a candidate is still being composed, and the field keeps showing the composing text.
- Once `compositionend` fires — the moment the user picks a candidate — the component writes the final text to `v-model`.
- Enter used to confirm a candidate does not emit `enter`. The event fires normally when the user presses Enter again to submit the form.

This keeps validation and submit logic built on `v-model` from reacting to partial input.

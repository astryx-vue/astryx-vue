---
layout: component-docs
title: Text Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textInputIcon, textInputSearch, textInputSizes, textInputStates, textInputVariant, textInputTypes } from '../../../../components/demos/text-input'
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





<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon. |
| <Badge variant="success">Do</Badge> | Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red. |
| <Badge variant="success">Do</Badge> | Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs. |
| <Badge variant="success">Do</Badge> | Add a clear button for search and filter inputs so users can quickly reset without selecting all text. |

## Examples

<DemoExample
  :demo="textInputIcon"
  description="Name, email, and password fields with a leading icon."
  locale="en"
  title="Icon"
/>

<DemoExample
  :demo="textInputSearch"
  description="Search fields with a magnifying glass and a clear button."
  locale="en"
  title="Search"
/>

<DemoExample
  :demo="textInputSizes"
  description="Small, medium, and large fields."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="textInputStates"
  description="Error, warning, and success messages, plus status without a message, disabled, and loading."
  locale="en"
  title="States"
/>

<DemoExample
  :demo="textInputVariant"
  description="The status message can sit against the field or float below it."
  locale="en"
  title="Status variant"
/>

<DemoExample
  :demo="textInputTypes"
  description="Description, password, email, tooltip, required, and optional fields."
  locale="en"
  title="Types"
/>

## Styling the container and the control

`TextInput` has two parts you can style:

- **Container**: the `Field` box around the label, the control box, and the status message. Use `container-class` and `container-style`.
- **Control**: the box that paints the border and background and holds the icons and the clear button. Use `control-class` and `control-style`.

Each set stays on its own part. Neither set reaches the native `<input>`.

```vue
<TextInput
  v-model="name"
  label="Name"
  container-class="my-field"
  :control-style="{ borderRadius: '12px' }"
/>
```

A `class` or `style` written directly on `<TextInput>` still lands on the control box and applies together with `control-class`. `id`, `data-*`, `aria-*`, and event listeners land on the native `<input>`.

Inside an `InputGroup`, and inside a `horizontal-labels` `FormLayout`, no container renders, so `container-*` has no effect and warns in development. To style an `InputGroup`, put the class on the `InputGroup` itself.

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

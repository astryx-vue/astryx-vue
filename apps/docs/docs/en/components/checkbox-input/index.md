---
layout: component-docs
title: Checkbox Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxInputStates, checkboxInputIndeterminate, checkboxInputStatus } from '../../../../components/demos/checkbox-input'
</script>

## Usage

Use `CheckboxInput` for a boolean option or a list of independent choices.
The component includes a label, description and status message.

```vue
<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const selected = shallowRef(false)
</script>

<template>
  <CheckboxInput v-model="selected" label="Email updates" />
</template>
```

Import the theme once in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Always provide a visible label so the user knows what they are toggling. Use isLabelHidden only when surrounding context makes it obvious. |
| <Badge variant="success">Do</Badge> | Add a description for choices that need extra context, like explaining what "Share usage data" actually shares. |
| <Badge variant="success">Do</Badge> | Use the indeterminate state for "select all" checkboxes when only some items in a group are selected. |
| <Badge variant="error">Don't</Badge> | Use a checkbox for mutually exclusive choices; use RadioList when only one option can be selected. |
| <Badge variant="error">Don't</Badge> | Use a checkbox for actions that take effect immediately; use a toggle switch or button instead. |
| <Badge variant="error">Don't</Badge> | Wrap a disabled checkbox in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead. |

## Examples

<DemoExample
  :demo="checkboxInputStates"
  description="Checked, unchecked, disabled, and indeterminate, each with a description."
  locale="en"
  title="States"
/>

<DemoExample
  :demo="checkboxInputIndeterminate"
  description="Select all shows a dash when only some notifications are on."
  locale="en"
  title="Indeterminate"
/>

<DemoExample
  :demo="checkboxInputStatus"
  description="Error, warning, and success messages under the checkbox."
  locale="en"
  title="Status"
/>

## Keyboard and accessibility

`CheckboxInput` renders a native `<input type="checkbox">`, so keyboard behaviour follows the browser defaults: press Tab to focus the checkbox, and press Space to toggle the selection.

The component wires the label, description and status message together through ARIA attributes, so assistive technology reads them as one unit:

- Always provide `label`; screen readers use it to describe what this option means. `isLabelHidden` only hides the visual label, and the label text still provides the accessible name.
- `aria-describedby` references the description and the status message, so both are announced on focus.
- The mixed state comes from the native `indeterminate` property, which browsers and assistive technology recognise directly.
- `isRequired` enables the browser's native required validation.
- When the status is an error, the component sets `aria-invalid`.

For a decorative selection mark on its own, use [CheckboxIndicator](/en/components/checkbox-indicator).

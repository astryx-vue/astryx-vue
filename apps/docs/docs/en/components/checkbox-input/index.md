---
layout: component-docs
title: Checkbox Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxInputBasic, checkboxInputSizes, checkboxInputIndeterminate, checkboxInputStates, checkboxInputForm, checkboxInputAsync } from '../../../../components/demos/checkbox-input'
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

<DemoExample :demo="checkboxInputBasic" title="Basic selection" description="Use v-model to control the selection. Click the label or description to toggle." locale="en" />

<DemoExample :demo="checkboxInputSizes" title="Sizes" description="sm is 20px. md is 24px." locale="en" />

<DemoExample :demo="checkboxInputIndeterminate" title="Select all and mixed selection" description="The parent shows a mixed state when some items are selected. Activating it changes the value to true." locale="en" />

<DemoExample :demo="checkboxInputStates" title="Disabled, read-only and loading" description="Loading blocks repeat activation. Hover or focus the disabled control to read its reason." locale="en" />

<DemoExample :demo="checkboxInputForm" title="Native forms" description="Select the required option before submitting. The reset handler updates v-model." locale="en" />

<DemoExample :demo="checkboxInputAsync" title="Async saving and retry" description="Enable failure simulation to show an error. Turn it off and change the selection to retry." locale="en" />

## Keyboard and accessibility

`CheckboxInput` renders a native `<input type="checkbox">`, so keyboard behaviour follows the browser defaults: press Tab to focus the checkbox, and press Space to toggle the selection.

The component wires the label, description and status message together through ARIA attributes, so assistive technology reads them as one unit:

- Always provide `label`; screen readers use it to describe what this option means. `isLabelHidden` only hides the visual label, and the label text still provides the accessible name.
- `aria-describedby` references the description and the status message, so both are announced on focus.
- The mixed state comes from the native `indeterminate` property, which browsers and assistive technology recognise directly.
- `isRequired` enables the browser's native required validation.
- When the status is an error, the component sets `aria-invalid`.

For a decorative selection mark on its own, use [CheckboxIndicator](/en/components/checkbox-indicator).

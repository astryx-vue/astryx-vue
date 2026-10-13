---
layout: component-docs
title: Switch
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { switchDescription, switchDisabled, switchSettings, switchStatus } from '../../../../components/demos/switch'
</script>

## Usage

`Switch` toggles a single boolean state.

```vue
<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const enabled = shallowRef(false)
</script>

<template>
  <Switch v-model="enabled" label="Notifications" />
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for settings that apply immediately; the toggle should take effect without a separate save action. |
| <Badge variant="success">Do</Badge> | Pair with a clear, concise label that describes the setting being controlled. |
| <Badge variant="error">Don't</Badge> | Use for options that require a form submission to take effect; use a checkbox instead. |
| <Badge variant="error">Don't</Badge> | Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead. |

## Examples

<DemoExample
  :demo="switchDisabled"
  description="A disabled switch with a label and a description, for a feature that is not available yet."
  locale="en"
  title="Disabled"
/>

<DemoExample
  :demo="switchSettings"
  description="Several settings in one card, each one a switch."
  locale="en"
  title="Settings panel"
/>

<DemoExample
  :demo="switchDescription"
  description="A line under the label says what turning the switch on will do."
  locale="en"
  title="With description"
/>

<DemoExample
  :demo="switchStatus"
  description="Error, warning, and success messages under the switch."
  locale="en"
  title="With status"
/>

## Keyboard interactions

`Switch` is built on a native checkbox, so its keyboard behaviour follows the browser's defaults and every action is reachable without a mouse. With focus on the switch, these keys apply:

- Tab moves focus to the switch.
- Space toggles the checked state.
- Escape closes the disabled-reason tooltip.

The disabled-reason tooltip only appears when the switch is disabled and a `disabledMessage` is provided, so Escape has an effect only in that case.

## Usage notes

Use a switch for a two-state option that takes effect right away, such as turning notifications on or off. If an option only applies once the form is submitted, use a checkbox instead; otherwise users may assume the switch has already saved the change.

`isRequired` only shows the required indicator and sets `aria-required`; it does not perform validation or block form submission.

---
layout: component-docs
title: Switch
outline: false
footer: false
---

<script setup lang="ts">
import { switchBasic, switchSizes, switchStates } from '../../../../components/demos/switch'
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

## Examples

<DemoExample :demo="switchBasic" title="Basic" description="Bind a boolean value with v-model. The label and description are automatically associated through Field." locale="en" />

<DemoExample :demo="switchSizes" title="Sizes" description="Switch comes in sm, md, and lg sizes." locale="en" />

<DemoExample :demo="switchStates" title="Disabled and read-only" description="When disabledMessage is provided, the disabled switch remains focusable so the reason can be read." locale="en" />

## Keyboard interactions

- Tab: focus the switch.
- Space: toggle the checked state.
- Escape: close the disabled-reason tooltip.

## Usage notes

- Use a switch for options that take effect immediately, not for form submission.
- `isRequired` only shows a required indicator; it does not perform validation.

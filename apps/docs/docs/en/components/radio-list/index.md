---
layout: component-docs
title: Radio List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { radioListDescriptions, radioListHorizontal, radioListPricing, radioListValidation } from '../../../../components/demos/radio-list'
</script>

## Usage

`RadioList` picks one value. Put a `RadioListItem` in the default slot, or pass an `options` array when the rows are plain text.

```vue
<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const channel = shallowRef('')
</script>

<template>
  <RadioList v-model="channel" label="Notification preference">
    <RadioListItem label="Email" value="email" />
    <RadioListItem label="SMS" value="sms" />
  </RadioList>
</template>
```

The indicator is 24px by default, and 20px when `size="sm"`. `orientation="horizontal"` lays the rows in a row with a 20px gap. The `end` slot sits on the trailing edge.


<ComponentAnatomy />

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the list short, usually two to seven options. |
| <Badge variant="error">Don't</Badge> | Use it when more than one option can be selected. Use CheckboxList. |
| <Badge variant="error">Don't</Badge> | Use a horizontal list for more than about four options. |

## Examples

<DemoExample :demo="radioListHorizontal" description="Small, medium, and large in a row." locale="en" title="Horizontal" />
<DemoExample :demo="radioListPricing" description="Each plan shows its price at the end of the row." locale="en" title="Pricing tier" />
<DemoExample :demo="radioListDescriptions" description="A description under each option." locale="en" title="With descriptions" />
<DemoExample :demo="radioListValidation" description="An empty required group shows an error." locale="en" title="With validation" />

---
layout: component-docs
title: Date Range Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateRangeInputPresets, dateRangeInputValidation } from '../../../../components/demos/date-range-input'
</script>

## Usage

`DateRangeInput` selects a start date and an end date. The value is `{ start, end }` with ISO dates, or `null`.

```vue
<script setup lang="ts">
import type { DateRange } from '@astryx-vue/core/DateRangeInput'
import { DateRangeInput } from '@astryx-vue/core/DateRangeInput'
import { shallowRef } from 'vue'

const range = shallowRef<DateRange | null>(null)
</script>

<template>
  <DateRangeInput v-model="range" label="Date range" />
</template>
```

The popover shows two months under one header. The first click sets the start. The second click commits the range when the span is allowed. Clicking the start again commits a single day when the shortest span is one day, and cancels the selection otherwise. The closed field omits the year when both ends are in the current year. Presets stay beside the calendars. When the two months no longer fit side by side, they wrap onto separate rows. A constraint can still turn individual days off. While a change is saving, the field cannot be edited.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Offer presets for the ranges people pick most often. |
| <Badge variant="success">Do</Badge> | Set `minRangeSpan` and `maxRangeSpan` when a one-day or a very long range is invalid. Counts include both ends. |
| <Badge variant="error">Don't</Badge> | Use it for one date. DateInput is the control for that. |

## Examples

<DemoExample :demo="dateRangeInputValidation" description="Error, warning, and success on a filled range." locale="en" title="Validation" />
<DemoExample :demo="dateRangeInputPresets" description="Presets for the last 7, 14, 30, and 90 days, or a custom range." locale="en" title="With presets" />

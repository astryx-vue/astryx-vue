---
layout: component-docs
title: Date Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateInputClearable, dateInputRange, dateInputFormats, dateInputDescription, dateInputValidation } from '../../../../components/demos/date-input'
</script>

## Usage

`DateInput` is a text field with a calendar button. People can type a date or open the calendar and pick a day.

Bind a date:

```vue
<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

const date = ref(null)
</script>

<template>
  <DateInput v-model="date" />
</template>
```

The value is a `Date`. By default the field shows a long date, such as March 21, 2026. `format` can be `date`, `date_long`, `date_weekday`, `system_date`, or a function that receives `YYYY-MM-DD`. `description` sits under the label. `status` as `{ type, message }` shows that message under the field. `presentation="bottom-sheet"` opens the calendar in a bottom sheet, and `adaptive-bottom-sheet` does that when the pointer is coarse.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Turn on `clearable` when the date is optional. |
| <Badge variant="success">Do</Badge> | Set `min` and `max` so people cannot pick a date the product will reject. |
| <Badge variant="success">Do</Badge> | Use a placeholder that shows the expected format. |
| <Badge variant="error">Don't</Badge> | Use it when the value needs a time of day. This field is a calendar date. |

## Examples

<DemoExample
  :demo="dateInputClearable"
  description="An optional event date with a clear button. The line above shows the selected value."
  locale="en"
  title="Clearable"
/>

<DemoExample
  :demo="dateInputDescription"
  description="Helper text under the label explains what the date is for."
  locale="en"
  title="Description"
/>

<DemoExample
  :demo="dateInputFormats"
  description="The same committed date as a short month, a long month, a weekday, an ISO date, or a custom string."
  locale="en"
  title="Formats"
/>

<DemoExample
  :demo="dateInputRange"
  description="Only the 8th through the 21st of the current month can be selected. A coarse pointer opens a bottom sheet."
  locale="en"
  title="Min and max"
/>

<DemoExample
  :demo="dateInputValidation"
  description="Error, warning, and success, each with a message."
  locale="en"
  title="Validation"
/>

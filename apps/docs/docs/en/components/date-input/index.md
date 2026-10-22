---
layout: component-docs
title: Date Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateInputClearable, dateInputRange, dateInputFormats, dateInputDescription, dateInputValidation, dateInputField, dateInputNative, dateInputSheet } from '../../../../components/demos/date-input'
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

The value is a local date. The field writes it back as a long date, such as March 21, 2026. It can also show a short date, a weekday, the system date, or custom text. A description can sit under the label, and validation can change the border or add a message under the field.

The calendar can open in a popover or a bottom sheet. The sheet shows one month. Picking a day writes it immediately, and Save closes the sheet. The month title opens month and year wheels. The system date control can be used all the time, or only on a touch device. When nothing is specified, a mouse gets the popover and a coarse pointer gets the system control. While a change is saving, the field cannot be edited. The save runs after the new value is written. The label can carry a hint and mark the field optional or required. The popover can show two months, and the week can start on a chosen day.


<ComponentAnatomy />

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

<DemoExample
  :demo="dateInputField"
  description="The date is written first, and the field stays busy until the save finishes. Weekends cannot be picked. The other field is marked optional."
  locale="en"
  title="Saving and labels"
/>

<DemoExample
  :demo="dateInputNative"
  description="The browser date control, with the committed day still shown as a long date."
  locale="en"
  title="System date"
/>

<DemoExample
  :demo="dateInputSheet"
  description="A bottom sheet on both mouse and touch. Picking a day writes it, and Save closes the sheet."
  locale="en"
  title="Bottom sheet"
/>

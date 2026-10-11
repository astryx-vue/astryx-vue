---
layout: component-docs
title: Date Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateInputBasic, dateInputClearable } from '../../../../components/demos/date-input'
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

The value is a `Date`. The field shows it as `YYYY-MM-DD`. Clicking the field opens the calendar, and choosing a day closes it. The placeholder, clear button, and calendar labels are English unless the app calls `provideAstryxLocale('zh-CN')`.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Turn on `clearable` when the date is optional. |
| <Badge variant="success">Do</Badge> | Set `min` and `max` so people cannot pick a date the product will reject. |
| <Badge variant="success">Do</Badge> | Use a placeholder that shows the expected format. |
| <Badge variant="error">Don't</Badge> | Use it when the value needs a time of day. This field is a calendar date. |

## Examples

<DemoExample
  :demo="dateInputBasic"
  description="Click to open calendar popover, select date to close automatically."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="dateInputClearable"
  description="Enable clearable to show clear button next to selected date."
  locale="en"
  title="Clearable"
/>

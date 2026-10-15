---
layout: component-docs
title: Date Time Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateTimeInputValidation } from '../../../../components/demos/date-time-input'
</script>

## Usage

`DateTimeInput` combines a date and a time. The value is `YYYY-MM-DDTHH:MM`, or `null` until both parts are set.

```vue
<script setup lang="ts">
import { DateTimeInput } from '@astryx-vue/core/DateTimeInput'
import { shallowRef } from 'vue'

const meeting = shallowRef<string | null>(null)
</script>

<template>
  <DateTimeInput v-model="meeting" label="Meeting time" has-clear />
</template>
```

The date uses the date field. The time uses the same field as the time input. The two fields stay side by side and shrink with the row. They wrap only when the row is narrower than 16rem. Clear removes both parts. The date half can show two months and can start the week on a chosen day. While a change is saving, neither field can be edited.


<ComponentAnatomy />

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Turn on `hasClear` when the appointment is optional. |
| <Badge variant="error">Don't</Badge> | Use it for a date with no time of day. DateInput is the smaller control. |

## Examples

<DemoExample :demo="dateTimeInputValidation" description="Error, warning, and success on a filled date and time." locale="en" title="Validation" />

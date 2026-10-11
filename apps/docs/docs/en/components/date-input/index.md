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

`DateInput` is a field that opens a calendar. The value is a `Date`, shown as `YYYY-MM-DD`.

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

---
layout: component-docs
title: Time Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { timeInputConstrained, timeInputFormats, timeInputIncrement, timeInputStates } from '../../../../components/demos/time-input'
</script>

## Usage

`TimeInput` edits a time of day. The value is an ISO time, `HH:MM` or `HH:MM:SS`, or `null`.

```vue
<script setup lang="ts">
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const time = shallowRef<string | null>('14:30')
</script>

<template>
  <TimeInput v-model="time" label="Time" />
</template>
```

The default hour format is 12-hour. Arrow keys step by `increment` minutes. On a fine pointer the field is typed text. On a coarse pointer, `adaptive-native` and `adaptive-bottom-sheet` use the platform time input, unless the field needs seconds or a step other than one minute. Placeholder and clear text follow the locale.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `min` and `max` when only part of the day is valid. |
| <Badge variant="success">Do</Badge> | Use `hourFormat="24h"` when the surrounding product already speaks in 24-hour time. |
| <Badge variant="error">Don't</Badge> | Ask for a calendar date here. Use DateInput or DateTimeInput. |

## Examples

<DemoExample :demo="timeInputConstrained" description="Dinner seating is limited to 5 PM through 10 PM." locale="en" title="Constrained" />
<DemoExample :demo="timeInputFormats" description="24-hour time, and a value that keeps seconds." locale="en" title="Formats" />
<DemoExample :demo="timeInputIncrement" description="Arrow keys move the value by 15 minutes." locale="en" title="Increment" />
<DemoExample :demo="timeInputStates" description="Disabled, error, warning, and success." locale="en" title="States" />

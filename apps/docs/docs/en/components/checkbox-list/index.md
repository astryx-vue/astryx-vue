---
layout: component-docs
title: Checkbox List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxListEndContent, checkboxListSelectAll } from '../../../../components/demos/checkbox-list'
</script>

## Usage

`CheckboxList` is a field around a list of `CheckboxListItem` rows. With `v-model`, the value is the array of checked item values.

```vue
<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { shallowRef } from 'vue'

const selected = shallowRef(['email'])
</script>

<template>
  <CheckboxList v-model="selected" label="Notifications">
    <CheckboxListItem label="Email" value="email" />
    <CheckboxListItem label="SMS" value="sms" />
  </CheckboxList>
</template>
```

Omit `v-model` when a row owns its own checked state, such as a select-all row. That row uses `isChecked` and `check`. `density="compact"` uses the small checkbox. A checked row uses the accent-muted background.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use a select-all row without a value when the list itself is not the collection. |
| <Badge variant="error">Don't</Badge> | Use a checkbox list for mutually exclusive choices. Use RadioList. |

## Examples

<DemoExample :demo="checkboxListSelectAll" description="Select all is indeterminate until every document is included." locale="en" title="Select all" />
<DemoExample :demo="checkboxListEndContent" description="Each row can end with a price badge." locale="en" title="With end content" />

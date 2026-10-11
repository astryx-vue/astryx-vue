---
layout: component-docs
title: Pagination
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { paginationBasic, paginationSizeChanger } from '../../../../components/demos/pagination'
</script>

## Usage

`Pagination` splits a long list into pages. People move with the page buttons or the previous and next controls.

Pass the total and bind the current page:

```vue
<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'

const page = ref(1)
const total = ref(100)
</script>

<template>
  <Pagination v-model:page="page" :total="total" />
</template>
```

`pageSize` is how many items each page holds. `showSizeChanger` lets people change that. `showTotal` shows how many items exist and which range the current page covers.

The visible labels are English unless the app calls `provideAstryxLocale('zh-CN')`.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use it under tables and lists that are too long for one page. |
| <Badge variant="success">Do</Badge> | Offer `showSizeChanger` when the list is large enough that page length matters. |
| <Badge variant="success">Do</Badge> | Show the total and the current range so people know how much data there is. |
| <Badge variant="error">Don't</Badge> | Rely on a long row of page buttons on a narrow screen. Keep the control compact. |

## Examples

<DemoExample
  :demo="paginationBasic"
  description="Click page numbers or use prev/next buttons to navigate."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="paginationSizeChanger"
  description="Enable showSizeChanger to let users choose page size."
  locale="en"
  title="Page Size"
/>

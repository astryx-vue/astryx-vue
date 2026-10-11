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

`Pagination` moves through a paged list. `page` is the current page, `pageSize` is the page length, and `total` is the number of items. `showSizeChanger` lets people change how many items each page holds.

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

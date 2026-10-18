---
layout: component-docs
title: useTablePagination
outline: false
footer: false
---

<script setup lang="ts">
import { useTablePaginationPaginatedData } from '../../../../components/demos/use-table-pagination'
</script>

## Usage

Call useTablePagination with a config object containing page state and callback. Pass the returned plugin to Table via the plugins prop.

```ts
import { paginateData, useTablePagination } from '@astryx-vue/core/Table'
```

The hook draws the controls only. You slice the rows yourself: `paginateData(rows, page, pageSize)` returns the window for the current page, and the same `pageSize` has to reach both the slice and the config.

`totalItems` is what the controls count with. When you already know the page count, give `totalPages` instead, and for cursor-based data where the total is unknown, set `hasMore: true` while another page exists. The controls stay out of the way when there is only one page and nothing more to load.

```ts
const page = ref(1)
const pageSize = 5
const plugin = useTablePagination(() => ({
  page: page.value,
  onPageChange(next) {
    page.value = next
  },
  totalItems: users.length,
  pageSize,
}))
const rows = computed(() => paginateData(users, page.value, pageSize))
```

`variant` picks what sits between the previous and next buttons: page numbers, a count, a compact "page X of Y", dots, or nothing. `position` decides whether the controls render above the table, below it, on both sides, or not at all; with `both` the two navs get distinct names so screen readers can tell them apart.

The config is read again on every access, so pass a getter when the page lives in a `ref`. A plain object works too, but the controls keep the page they saw first.

## Examples

<DemoExample
  :demo="useTablePaginationPaginatedData"
  description="Paginated data table navigating through a larger dataset page by page."
  locale="en"
  title="Table — Paginated Data"
/>

---
layout: component-docs
title: useTableInfiniteScroll
outline: false
footer: false
---

<script setup lang="ts">
import { useTableInfiniteScrollLoadMore } from '../../../../components/demos/use-table-infinite-scroll'
</script>

## Usage

Hook that returns a TablePlugin for loading flat data in batches. Rows, cursors and error messages stay with you: keep appending each batch to `data` and tell the plugin whether more rows exist and whether a request is in flight. While `hasMore` is true, a **Load more** button sits below the table; when the end of the table scrolls into the viewport, the next batch loads automatically. While the first batch is still loading, the table does not show its default empty state.

```ts
import { useTableInfiniteScroll } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableInfiniteScrollLoadMore"
  description="Eight rows per batch, thirty in all. Scroll to the end of the table or press Load more; the button goes away after the last batch."
  locale="en"
  title="useTableInfiniteScroll — Load more"
/>

## Best practices

- Return the request's Promise from `onLoadMore` and keep `isLoading` true while it runs. Only one request is in flight at a time, automatic or manual.
- When a batch fails, show the error yourself. Automatic loading pauses after a failure; the Load more button still works as a retry, and one success resumes automatic loading.
- Use it for flat lists. For grouped, tree or paginated tables, load the data your own way.

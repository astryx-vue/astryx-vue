---
layout: component-docs
title: Pagination
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

`Pagination` is a navigation component for dividing large datasets into multiple pages. Users can navigate by clicking page numbers, previous/next buttons, or entering a page number directly.

Basic usage requires the total item count and current page number:

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

Use the `pageSize` property to set items per page:

```vue
<template>
  <Pagination v-model:page="page" :total="total" :page-size="20" />
</template>
```

Enable `showSizeChanger` to let users choose items per page:

```vue
<template>
  <Pagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="total"
    show-size-changer
    :page-size-options="[10, 20, 50, 100]"
  />
</template>
```

Enable `showQuickJumper` to let users enter a page number to jump directly:

```vue
<template>
  <Pagination
    v-model:page="page"
    :total="total"
    show-quick-jumper
  />
</template>
```

The component automatically calculates total pages and displays an appropriate page number list. Excessive page numbers are replaced with ellipses.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use pagination for tables, lists, and other data display scenarios. |
| <Badge variant="success">Do</Badge> | Provide page jump and size selection for large datasets. |
| <Badge variant="success">Do</Badge> | Display total count and current range so users understand data scope. |
| <Badge variant="error">Don't</Badge> | Use too many page buttons on mobile; consider simple mode. |
| <Badge variant="error">Don't</Badge> | Use pagination for small datasets (e.g., under 50 items); consider scroll loading. |

## Examples

Pagination component examples will display normally in the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Current page number |
| `pageSize` | `number` | `10` | Items per page |
| `total` | `number` | Required | Total item count |
| `disabled` | `boolean` | `false` | Whether disabled |
| `showSizeChanger` | `boolean` | `false` | Whether to show size changer |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Page size options |
| `showQuickJumper` | `boolean` | `false` | Whether to show quick jumper |
| `showTotal` | `boolean` | `true` | Whether to show total count |
| `simple` | `boolean` | `false` | Simple mode |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |

## Emits

| Name | Parameters | Description |
| --- | --- | --- |
| `update:page` | `page: number` | Emitted when page changes |
| `update:pageSize` | `pageSize: number` | Emitted when page size changes |
| `change` | `{ page: number, pageSize: number }` | Emitted when page or size changes |

## Slots

| Name | Parameters | Description |
| --- | --- | --- |
| `total` | `{ total: number, range: [number, number] }` | Customize total display |

## Keyboard Interaction

| Key | Function |
| --- | --- |
| `Tab` | Move focus between page buttons |
| `Enter` / `Space` | Activate focused page button |
| `ArrowLeft` | Move to previous page button |
| `ArrowRight` | Move to next page button |
| `Home` | Jump to first page |
| `End` | Jump to last page |

## Accessibility

- Uses `<nav>` with `role="navigation"` semantics
- Page buttons include descriptive `aria-label`
- Current page marked with `aria-current="page"`
- Disabled state marked with `aria-disabled="true"`
- Full keyboard navigation support

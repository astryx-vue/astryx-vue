---
layout: component-docs
title: useTablePagination
outline: false
footer: false
---

<script setup lang="ts">
import { useTablePaginationPaginatedData } from '../../../../components/demos/use-table-pagination'
</script>

## 使用方法

调用 useTablePagination，传入包含页码状态和回调的配置对象。返回的插件通过 plugins 属性交给 Table。

```ts
import { paginateData, useTablePagination } from '@astryx-vue/core/Table'
```

这个 hook 只画控件，切行要自己做：`paginateData(rows, page, pageSize)` 给出当前页那一段，而 `pageSize` 要同时交给切片和配置。控件按 `totalItems` 算总页数，不给就只显示一页。

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

每次读配置都会重新取值，所以页码存在 `ref` 里时要传 getter。直接传对象也能跑，但控件会停在第一次读到的页码上。

## 示例

<DemoExample
  :demo="useTablePaginationPaginatedData"
  description="在一份较大的数据里一页一页翻的分页表格。"
  locale="zh"
  title="Table — 分页数据"
/>

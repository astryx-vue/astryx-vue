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

把当前页和翻页回调交给 `useTablePagination`，再把返回的插件放进 `Table` 的 `plugins`。

```ts
import { paginateData, useTablePagination } from '@astryx-vue/core/Table'
```

这个 hook 只画控件，行还是你自己切：`paginateData(rows, page, pageSize)` 返回当前页的窗口，同一个 `pageSize` 要同时给切片和配置。

页数靠 `totalItems` 算。已经知道页数时改给 `totalPages`；游标分页不知道总数时，只要后面还有内容就把 `hasMore` 设成 `true`。只有一页、也没有下一页时控件自己藏起来。

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

`variant` 决定上一页和下一页之间放什么：页码、条数、紧凑的「第几页 / 共几页」、圆点，或者什么都不放。`position` 决定控件在表格上方、下方、上下都有，还是不要；取 `both` 时两块导航区的名字会区分开，读屏不会把它们当成同一个。

每次读配置都会重新取值，所以页码存在 `ref` 里时要传 getter。直接传对象也能跑，但控件会用第一次读到的页码。

## 示例

<DemoExample
  :demo="useTablePaginationPaginatedData"
  description="分页展示较大数据集的表格，一页一页翻。"
  locale="zh"
  title="Table — 分页数据"
/>

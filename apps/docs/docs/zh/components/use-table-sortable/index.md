---
layout: component-docs
title: useTableSortable
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSortableColumns } from '../../../../components/demos/use-table-sortable'
</script>

## 使用方法

把排序状态和它的回调放进配置对象，交给 `useTableSortable`。它返回的插件通过 `plugins` 属性传给 `Table`。

```ts
import { useTableSortable } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableSortableColumns"
  description="列可以排序的表格。点表头就在升序和降序之间切换。"
  locale="zh"
  title="useTableSortable —— 可排序的列"
/>

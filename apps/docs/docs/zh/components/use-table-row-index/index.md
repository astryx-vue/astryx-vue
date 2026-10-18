---
layout: component-docs
title: useTableRowIndex
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowIndexNumberedRows } from '../../../../components/demos/use-table-row-index'
</script>

## 使用方法

返回一个 `TablePlugin`，在表格最前面加一列右对齐、等宽的序号。序号跟着当前渲染的数据顺序走（排序、过滤、分页之后的结果），默认从 1 开始。`renderCell` 只拿到一行数据，所以插件需要你传入当前渲染的数据数组，用它算出每一行的序号。

```ts
import { useTableRowIndex } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableRowIndexNumberedRows"
  description="在最前面加了一列序号的表格。序号是等宽字体、右对齐，顺序跟着渲染后的数据。"
  locale="zh"
  title="useTableRowIndex —— 行号列"
/>

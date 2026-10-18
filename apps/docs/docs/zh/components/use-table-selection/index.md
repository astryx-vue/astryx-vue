---
layout: component-docs
title: useTableSelection
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSelectionRowSelection } from '../../../../components/demos/use-table-selection'
</script>

## 使用方法

返回一个 `TablePlugin`，实现行选择：复选框列、全选，以及 `aria-selected`。复选框列由表格自己加，不用你在 `columns` 里写。选择状态是从你给的 getter 里现读的，这些 getter 读到哪个响应式状态，复选框就跟着哪个状态走，不需要再套一层 provider。

```ts
import { useTableSelection } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableSelectionRowSelection"
  description="带行选择复选框和表头全选复选框的表格。"
  locale="zh"
  title="useTableSelection —— 行选择"
/>

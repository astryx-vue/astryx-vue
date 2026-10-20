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

两个 getter 决定一行长什么样。`getIsItemSelectable` 让没什么可选的行连复选框都不显示；`getIsItemEnabled` 保留复选框但把它禁用，用在「这一行现在不能选」的场合。

```ts
const selection = useTableSelection({
  getIsItemSelected: item => selectedKeys.value.has(item.id),
  onSelectItem: ({ item, isSelected }) => { /* ... */ },
  onSelectAll: ({ isAllSelected }) => { /* ... */ },
  getIsAllSelected: () => /* ... */ false,
  getIsItemSelectable: item => item.role !== 'System',
  getIsItemEnabled: item => item.status !== 'Locked',
})
```

`hasRowHighlight` 只管选中行上那层浅色底。`aria-selected` 无论如何都写在选中的行上，所以就算周围界面已经用行底色表达别的意思，选中状态照样念得出来。

## 示例

<DemoExample
  :demo="useTableSelectionRowSelection"
  description="带行选择复选框和表头全选复选框的表格。"
  locale="zh"
  title="useTableSelection —— 行选择"
/>

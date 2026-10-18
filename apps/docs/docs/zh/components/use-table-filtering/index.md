---
layout: component-docs
title: useTableFiltering
outline: false
footer: false
---

<script setup lang="ts">
import { useTableFilteringInline, useTableFilteringPopover } from '../../../../components/demos/use-table-filtering'
</script>

## 使用方法

给表格的列加过滤器，控件可以是行内的，也可以在弹出层里。列的 `filter` 指向 `fields` 里的某个字段时，这一列才有过滤器。`inline` 变体把控件放在表头单元格里、列名下面；`inline-compact` 是同一个位置，但控件更紧凑，表格窄的时候用；`popover` 变体把它藏在一个漏斗按钮后面，确认后才生效。状态交给 `useTableFilterState` 管。

```ts
import { useTableFiltering, useTableFilterState } from '@astryx-vue/core/Table'
```

支持五种字段类型，每种都有对应的控件：

| `type` | 控件 | 命中条件 |
| --- | --- | --- |
| `string` | 文本框 | 单元格文字包含输入的子串 |
| `enum` | 下拉 | 正好是某个选项 |
| `multi-select` | 多选列表 | 是勾选中的任意一个选项 |
| `number` | 数字框 | 数值相等 |
| `date` | 日期选择 | 单元格日期比选的更晚 |

```ts
const fields: TableFilterField[] = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'role', label: 'Role', type: 'enum', options: roleOptions },
  { key: 'teams', label: 'Teams', type: 'multi-select', options: teamOptions },
  { key: 'age', label: 'Age', type: 'number', min: 18, max: 70, isIntegerOnly: true },
  { key: 'hired', label: 'Hired', type: 'date' },
]
```

`applyTableFilters()` 返回同时满足所有生效过滤的行，插件自己不碰 `data`。

```ts
const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
  variant: 'inline',
}))
const rows = computed(() => applyTableFilters(employees, filters.value, fields))
```

每次读配置都会重新取值，所以过滤值存在 `ref` 里时要传 getter。直接传对象也能跑，但表格会用第一次读到的过滤值。

行内变体里，带过滤但没有写 `width` 的列会被补成 `proportional(1)`，控件在列名下面放得开。

这套过滤和 Power Search 是分开的。没有 `filter` 的列永远不会被过滤，插件对它什么也不画。

## 示例

<DemoExample
  :demo="useTableFilteringInline"
  description="在每个表头下面直接放一行过滤控件的表格。"
  locale="zh"
  title="Table — 行内过滤"
/>

<DemoExample
  :demo="useTableFilteringPopover"
  description="点表头上的图标，在弹出层里过滤的表格。"
  locale="zh"
  title="Table — 弹出过滤"
/>

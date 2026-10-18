---
layout: component-docs
title: useTableFilterState
outline: false
footer: false
---

<script setup lang="ts">
import { useTableFilterStateInline, useTableFilterStatePopover } from '../../../../components/demos/use-table-filter-state'
</script>

## 使用方法

管表格过滤状态。它交出当前的过滤映射、一个改值的处理函数，还有一个清空的办法。把映射和处理函数交给 `useTableFiltering`，把映射交给 `applyTableFilters()` 就能拿到匹配的行。

```ts
import { useTableFilterState } from '@astryx-vue/core/Table'
```

一条过滤「关掉」的意思是它的 key 不在映射里。写 `null`、空字符串或空数组时，key 会被删掉，而不是存一个空值，所以映射里还留着的 key 一定是生效的过滤。

需要打开页面就带着过滤时，给一个初始映射。初始对象是浅拷贝的，后面怎么写都不会改到你传进去的那份。

```ts
const { filters, onFilterChange, clearAll } = useTableFilterState({ role: 'Engineer' })
```

## 示例

<DemoExample
  :demo="useTableFilterStateInline"
  description="行内过滤控件，过滤映射由 useTableFilterState 保存。"
  locale="zh"
  title="Table — 行内过滤"
/>

<DemoExample
  :demo="useTableFilterStatePopover"
  description="弹出层里的过滤控件，用的是同一份受管状态。"
  locale="zh"
  title="Table — 弹出过滤"
/>

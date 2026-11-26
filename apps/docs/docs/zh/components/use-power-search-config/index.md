---
layout: component-docs
title: usePowerSearchConfig
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { usePowerSearchConfigFilteredDirectory } from '../../../../components/demos/use-power-search-config'
</script>

## 使用方法

用带类型的字段定义生成 [结构化搜索](/components/power-search) 的配置，同时返回一个在前端筛选数据的 `applyFilters`。每种字段类型（字符串、数字、布尔、日期、枚举、枚举列表、字符串列表）都配好对应的运算符，`applyFilters` 留下符合当前筛选条件的那些行。它是 `createPowerSearchConfig` 在组件 setup 里的写法。

```ts
import { usePowerSearchConfig } from '@astryx-vue/core/PowerSearch'
```

```vue
<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { PowerSearch, usePowerSearchConfig } from '@astryx-vue/core/PowerSearch'
import { computed, ref } from 'vue'

const fields = [
  { key: 'name', type: 'string', label: '姓名' },
  { key: 'active', type: 'boolean', label: '在职' },
] as const

const { config, applyFilters } = usePowerSearchConfig(fields)
const filters = ref<PowerSearchFilter[]>([])
const rows = computed(() => applyFilters(filters.value, people))
</script>

<template>
  <PowerSearch v-model:filters="filters" :config="config" :result-count="rows.length" />
</template>
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 字段定义放在组件外面，加上 `as const`，这样 `applyFilters` 知道每一行长什么样。 |
| <Badge variant="success">推荐</Badge> | 把返回的 `config` 交给 `PowerSearch`，再用 `applyFilters` 算出 `Table` 或 `List` 要显示的行。 |
| <Badge variant="error">避免</Badge> | 用响应式数据拼字段定义，还指望配置跟着变。配置只在组件 setup 时生成一次。 |

## 示例

<DemoExample
  :demo="usePowerSearchConfigFilteredDirectory"
  description="一个人员名录：表格上方是结构化搜索框。带类型的字段定义交给 usePowerSearchConfig，它返回搜索配置和 applyFilters，表格的行随筛选条件更新。"
  locale="zh"
  title="usePowerSearchConfig —— 可筛选的名录表格"
/>

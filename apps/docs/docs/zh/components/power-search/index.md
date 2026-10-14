---
layout: component-docs
title: 结构化搜索
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { powerSearchDisabled, powerSearchNested, powerSearchOverflow, powerSearchOverview } from '../../../../components/demos/power-search'
</script>

## 使用方法

结构化搜索把一条查询拆成字段、运算符和值。聚焦输入框会列出字段。选中之后，如果这个运算符还要填值，就打开编辑器；布尔值和全文搜索会直接变成一条条件。条件以标签的形式排在输入框里，点开可以修改。

输入为空时，退格键删掉最后一条。左右方向键在标签之间移动，回车打开当前标签，退格或删除键去掉它。只读的条件不能改，也不能删。按 Esc 会取消编辑并把焦点还回去。

编辑器的宽度跟搜索条走，最窄大约 400，最宽 720。窗口放不下一个最小宽度时，下限让给窗口。只有被最大宽度压窄时，编辑器才改贴打开它的那一侧。打开之后位置先定住，关掉之前不跟着搜索条挪。

`createPowerSearchConfig` 根据字段定义生成运算符，并返回一个独立的 `applyFilters`。它只负责把行滤出来，不经过表格自己的列过滤。时间、相对日期、实体和自定义值默认全部保留，调用方要自己解释。嵌套条件默认每一条都要满足；运算符名字里带 any，或者就是 or，则满足任意一条即可。

失焦时标签可以收成一行。`unfocused-inline` 在原处展开，`unfocused-layer` 浮在字段上，不把下面的内容往下推。结果数量是数字时会按单复数读出来，是字符串时原样显示。数量变化会礼貌地播报，第一次出现不播。

禁用原因和禁用一起用时，输入框仍然可以聚焦，悬停或键盘聚焦能看到原因。不要再在外面套一层提示，原生禁用会把悬停吃掉。

```vue
<script setup lang="ts">
import { createPowerSearchConfig, PowerSearch } from '@astryx-vue/core/PowerSearch'
import { computed, ref } from 'vue'

const people = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
]
const { config, applyFilters } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'active', type: 'boolean', label: 'Active' },
])
const filters = ref([])
const matched = computed(() => applyFilters(filters.value, people))
</script>

<template>
  <PowerSearch v-model:filters="filters" :config="config" :result-count="matched.length" />
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 字段很多时给它们分组，并给常用字段加上别名，方便搜到。 |
| <Badge variant="success">推荐</Badge> | 全文搜索单独指定一个字符串字段，不要让每个字段都吃掉用户随手打的字。 |
| <Badge variant="error">避免</Badge> | 把结构化搜索塞进表格列上的过滤。列过滤仍然只做包含和枚举匹配。 |
| <Badge variant="error">避免</Badge> | 在嵌套条件还没填完时允许保存。没填完的子条件不能变成一条真正的筛选。 |

## 示例

<DemoExample
  :demo="powerSearchOverview"
  description="按姓名、角色、是否在职和年龄筛选。下面的名单跟着当前条件变。"
  locale="zh"
  title="字段和运算符"
/>

<DemoExample
  :demo="powerSearchOverflow"
  description="失焦时收成一行，末尾写出还藏着几条。聚焦后再展开。"
  locale="zh"
  title="放不下的标签"
/>

<DemoExample
  :demo="powerSearchNested"
  description="匹配可以要求全部子条件，也可以只要求其中任意一条。"
  locale="zh"
  title="组合条件"
/>

<DemoExample
  :demo="powerSearchDisabled"
  description="索引重建时不能改条件，但输入框仍能聚焦，并说明原因。"
  locale="zh"
  title="暂停搜索"
/>

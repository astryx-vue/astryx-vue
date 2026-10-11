---
layout: component-docs
title: 分页
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { paginationBasic, paginationSizeChanger } from '../../../../components/demos/pagination'
</script>

## 使用方法

`Pagination` 是一个分页导航组件，用于将大量数据分割成多个页面展示。用户可以通过点击页码、上下页按钮或输入页码跳转到指定页面。

基本用法需要提供总条目数和当前页码：

```vue
<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'

const page = ref(1)
const total = ref(100)
</script>

<template>
  <Pagination v-model:page="page" :total="total" />
</template>
```

通过 `pageSize` 属性设置每页显示的条目数。开启 `showSizeChanger` 后，用户可以自行选择每页显示数量。按钮和总数文案默认是英文，调用 `provideAstryxLocale('zh-CN')` 后改为中文。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在表格、列表等数据展示场景使用分页控制。 |
| <Badge variant="success">推荐</Badge> | 数据量大时提供页码跳转和每页数量选择功能。 |
| <Badge variant="success">推荐</Badge> | 显示总条目数和当前范围，让用户了解数据规模。 |
| <Badge variant="error">避免</Badge> | 在窄屏上铺一长排页码按钮。页码很多时让控件保持紧凑。 |

## 示例

<DemoExample
  :demo="paginationBasic"
  description="点击页码跳转，使用上下页按钮导航，支持键盘交互。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="paginationSizeChanger"
  description="开启 showSizeChanger 后，用户可以选择每页显示数量。"
  locale="zh"
  title="每页数量选择"
/>

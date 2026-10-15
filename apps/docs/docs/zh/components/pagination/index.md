---
layout: component-docs
title: 分页
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { paginationDots, paginationPageSize, paginationWithTable } from '../../../../components/demos/pagination'
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


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在表格、列表等数据展示场景使用分页控制。 |
| <Badge variant="success">推荐</Badge> | 数据量大时提供页码跳转和每页数量选择功能。 |
| <Badge variant="success">推荐</Badge> | 显示总条目数和当前范围，让用户了解数据规模。 |
| <Badge variant="error">避免</Badge> | 在窄屏上铺一长排页码按钮。页码很多时让控件保持紧凑。 |

## 示例

<DemoExample :demo="paginationDots" description="圆点分页用来翻过几条评价。总数不大时，位置比页码更重要。" locale="zh" title="圆点轮播" />

<DemoExample :demo="paginationPageSize" description="分页放在交易表格下面，并可以调整每页行数。" locale="zh" title="每页数量" />

<DemoExample :demo="paginationWithTable" description="小号的计数分页放在表格下面，显示当前页覆盖的条目范围。" locale="zh" title="表格分页" />

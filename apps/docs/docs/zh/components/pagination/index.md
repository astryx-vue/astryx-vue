---
layout: component-docs
title: 分页
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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

通过 `pageSize` 属性设置每页显示的条目数：

```vue
<template>
  <Pagination v-model:page="page" :total="total" :page-size="20" />
</template>
```

开启 `showSizeChanger` 后，用户可以自行选择每页显示数量：

```vue
<template>
  <Pagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="total"
    show-size-changer
    :page-size-options="[10, 20, 50, 100]"
  />
</template>
```

开启 `showQuickJumper` 后，用户可以输入页码快速跳转：

```vue
<template>
  <Pagination
    v-model:page="page"
    :total="total"
    show-quick-jumper
  />
</template>
```

组件会自动计算总页数，并根据当前页显示合适的页码列表。超过一定数量的页码会被省略号代替。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在表格、列表等数据展示场景使用分页控制。 |
| <Badge variant="success">推荐</Badge> | 数据量大时提供页码跳转和每页数量选择功能。 |
| <Badge variant="success">推荐</Badge> | 显示总条目数和当前范围，让用户了解数据规模。 |
| <Badge variant="error">避免</Badge> | 在移动端使用过多的页码按钮，考虑使用简洁模式。 |
| <Badge variant="error">避免</Badge> | 总条目数很少（如少于 50）时使用分页，考虑滚动加载。 |

## 示例

分页组件示例将在应用中正常显示。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `page` | `number` | `1` | 当前页码 |
| `pageSize` | `number` | `10` | 每页条目数 |
| `total` | `number` | 必填 | 总条目数 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `showSizeChanger` | `boolean` | `false` | 是否显示每页数量选择器 |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 每页数量选项 |
| `showQuickJumper` | `boolean` | `false` | 是否显示快速跳转 |
| `showTotal` | `boolean` | `true` | 是否显示总条目数 |
| `simple` | `boolean` | `false` | 简洁模式 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |

## Emits

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:page` | `page: number` | 页码变化时触发 |
| `update:pageSize` | `pageSize: number` | 每页数量变化时触发 |
| `change` | `{ page: number, pageSize: number }` | 页码或每页数量变化时触发 |

## Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `total` | `{ total: number, range: [number, number] }` | 自定义总数显示 |

## 键盘交互

| 按键 | 功能 |
| --- | --- |
| `Tab` | 在页码按钮间切换焦点 |
| `Enter` / `Space` | 激活当前焦点的页码按钮 |
| `ArrowLeft` | 移动到上一页按钮 |
| `ArrowRight` | 移动到下一页按钮 |
| `Home` | 跳转到第一页 |
| `End` | 跳转到最后一页 |

## 无障碍

- 使用 `<nav>` 和 `role="navigation"` 语义
- 页码按钮包含 `aria-label` 说明
- 当前页标记 `aria-current="page"`
- 禁用状态标记 `aria-disabled="true"`
- 完整的键盘导航支持

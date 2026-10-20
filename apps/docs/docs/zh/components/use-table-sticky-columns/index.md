---
layout: component-docs
title: useTableStickyColumns
outline: false
footer: false
---

<script setup lang="ts">
import { useTableStickyColumnsPinned } from '../../../../components/demos/use-table-sticky-columns'
</script>

## 使用方法

返回一个 `TablePlugin`，把连续的一段列固定在表格的开头边缘或末尾边缘（也可以两边都固定）。被固定的列会拿到累加的偏移量，滚动内容上方还会加一层柔和的阴影，只在能滚动的那一侧出现。配置传空对象 `{}` 也合法，就是什么都不固定。

```ts
import { useTableStickyColumns } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableStickyColumnsPinned"
  description="Name 留在左边，Friday 留在右边，中间的日子横向滚动。滚动内容上方的阴影告诉你哪一侧还藏着列。"
  locale="zh"
  title="useTableStickyColumns —— 固定列"
/>

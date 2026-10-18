---
layout: component-docs
title: useTableColumnResize
outline: false
footer: false
---

<script setup lang="ts">
import { useTableColumnResizeDraggableColumns } from '../../../../components/demos/use-table-column-resize'
</script>

## 使用方法

这个组合式函数返回一个 `TablePlugin`，给列表头的边缘加上可以拖的把手。拖动表头右边缘时这一列会先按新宽度显示。松开指针才提交：插件把每个宽度变了的列交给 `onColumnResizeEnd`，你把它并进 `columnWidths`。最窄 60px。

```ts
import { useTableColumnResize } from '@astryx-vue/core/Table'
```

每次读配置都会重新取值，所以宽度存在 `ref` 里时要传 getter。直接传对象也能跑，但表格会用第一次读到的那份宽度。

这个 hook 只负责记录和交出宽度。它不会同时调整相邻列，也没有键盘和 RTL 方向的处理。

## 示例

<DemoExample
  :demo="useTableColumnResizeDraggableColumns"
  description="用 useTableColumnResize 的表格。拖任意列表头的右边缘就能改宽，松开指针后保留。剩下的比例列分掉剩余宽度。"
  locale="zh"
  title="useTableColumnResize — 可拖动列宽"
/>

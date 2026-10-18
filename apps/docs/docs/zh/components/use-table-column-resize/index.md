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

这个组合式函数返回一个 `TablePlugin`，给列表头的边缘加上可以拖的把手。除了最后一列比例列之外，每列行末都有一个把手；最后一列比例列不给把手，它负责吃掉剩下的空间。拖动时先按新宽度预览，松开指针才提交：`onColumnResizeEnd` 拿到所有宽度变了的列，你把它并进 `columnWidths`。

```ts
import { useTableColumnResize } from '@astryx-vue/core/Table'
```

比例列把宽度让给旁边可拖的列，所以拖动时表格一直撑满。固定像素列没有邻列可让，只有自己变宽变窄，差值由最后一列吸收。

```ts
const columnWidths = ref<Record<string, number>>({})
const resizePlugin = useTableColumnResize(() => ({
  columnWidths: columnWidths.value,
  minWidth: 80,
  maxWidth: 400,
  onColumnResizeEnd(updates) {
    columnWidths.value = { ...columnWidths.value, ...updates }
  },
}))
```

每次读配置都会重新取值，所以宽度存在 `ref` 里时要传 getter。直接传对象也能跑，但表格会用第一次读到的那份宽度。

### 能拖多窄、多宽

每列的下限来自列自己：`proportional(n, { minWidth })` 用它给的 `minWidth`，`pixel(n)` 的列不会窄过 `n`，没有 `width` 的列停在 60px。配置里的 `minWidth` 一设就盖过这些下限，`maxWidth` 是所有列共同的上限。

### 键盘和 RTL

把手是一个 WAI-ARIA 窗口分隔条：聚焦后按左、右方向键移动 10px，按住 Shift 移动 50px，按 Home 跳到最窄，按 End 跳到 `maxWidth`。左右跟随书写方向，所以在 RTL 下按键调宽的方向是反的。

## 示例

<DemoExample
  :demo="useTableColumnResizeDraggableColumns"
  description="用 useTableColumnResize 的表格。拖任意列表头的右边缘就能改宽，松开指针后提交。剩下的比例列分掉剩余宽度。"
  locale="zh"
  title="useTableColumnResize — 可拖动列宽"
/>

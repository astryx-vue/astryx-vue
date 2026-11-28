---
layout: component-docs
title: useTableSelectionState
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSelectionStateLeadingMark, useTableSelectionStateRowSelection } from '../../../../components/demos/use-table-selection-state'
</script>

## 使用方法

`useTableSelection` 的配套状态工具。它返回两个东西：`selectionConfig` 交给选择插件，`selectionState` 交给关心选择状态的界面，比如 `TableSelectionToolbar`。选中结果仍然是受控的：选中的键那个 `Set` 由你保存，再给一个写回的函数。全选只勾真正能勾的行，不能选和被禁用的行保留原来的状态。`idKey` 可以给属性名，也可以给一个从行里取键的函数。

```ts
import { useTableSelectionState } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableSelectionStateRowSelection"
  description="带行选择复选框和表头全选复选框的表格。选中的键和写回函数留在调用方，selectionState 把它们映射给工具栏这类关心选择状态的界面。"
  locale="zh"
  title="useTableSelectionState —— 行选择"
/>

<DemoExample
  :demo="useTableSelectionStateLeadingMark"
  description="不单独放复选框列：每个人显示头像，鼠标悬停、键盘聚焦，或已经有行被选中时，复选框占到头像的位置。状态来自 useTableSelectionState；复选框画在姓名列里，所以被勾选的行不会带 aria-selected 和高亮，需要的话自己加。"
  locale="zh"
  title="useTableSelectionState — 用头像位置勾选"
/>

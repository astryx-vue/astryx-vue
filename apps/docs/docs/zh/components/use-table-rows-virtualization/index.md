---
layout: component-docs
title: useTableRowsVirtualization
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowsVirtualizationThousandRows } from '../../../../components/demos/use-table-rows-virtualization'
</script>

## 使用方法

返回一个 `TablePlugin`，让很长的扁平表格只渲染看得见的那几行。打个比方：一千行数据像一卷很长的纸，表格只把窗口里露出来的那一段真的画出来，上下没露出来的部分用一块等高的空白撑着，滚动条的长短和手感都和全部画出来时一样。窗口前后各多画几行，快速滚动时不会露白。

```ts
import { useTableRowsVirtualization } from '@astryx-vue/core/Table'
```

表格会填满父元素给的高度，并在里面上下滚动。所以要给父元素一个高度：固定值、百分比，或者 flex 子项都行。数据、列、`idKey` 和别的插件照常传给表格。

## 示例

<DemoExample
  :demo="useTableRowsVirtualizationThousandRows"
  description="一千行订单放在 320px 高的容器里，同时开着多选和序号。滚动时只有视口附近的几十行在页面上。"
  locale="zh"
  title="useTableRowsVirtualization — 一千行"
/>

## 建议

- `rowHeight` 写一行的真实总高度（含内边距和分隔线）。行不会比它矮；所有行一起变高时（例如用户放大了字号），表格会改用量到的行高，并在开发环境提醒你。
- 开启后，单元格默认单行显示、超出部分用省略号截断，这样每一行一样高。显式写 `textOverflow="wrap"` 会退回全部渲染。
- 下面这些情况表格会退回全部渲染，并在开发环境说明原因：分组、树形或可展开详情的行；有重复或缺失的行 ID；写了 `rowIndexStart` 或 `rowCount`；有 `renderCell` 的自定义列；挂载后发现行高不一致或内容溢出。
- 键盘焦点所在的行滚出视口后会继续留在页面上，焦点不会丢。读屏会读到真实的总行数和每一行的位置。
- 列也很多时，再加上 `useTableColumnsVirtualization`，两个插件一起放进 `plugins`。

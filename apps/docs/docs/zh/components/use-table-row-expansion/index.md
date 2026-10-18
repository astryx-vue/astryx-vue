---
layout: component-docs
title: useTableRowExpansion
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowExpansionDetail } from '../../../../components/demos/use-table-row-expansion'
</script>

## 使用方法

这个组合式函数返回一个 TablePlugin，能在某一行下面展开一整块详情面板，内容由使用方通过 renderExpanded(item) 画出。它会加上一列前置的折叠按钮，并在右键菜单里加一项「展开/折叠行」；被展开的 expandedKeys 集合由你保存。面板横跨整行，但内容从第一列开始、跳过折叠按钮，所以详情和上面的列名对得齐；左侧留白跟着表格密度走。适合主从结构的行（订单详情、表单、图表、嵌套表格）。子行复用父行那些列的层级数据，用 useTableTreeData + useTableTreeState。

```ts
import { useTableRowExpansion } from '@astryx-vue/core/Table'
```

`renderExpanded` 返回 `VNodeChild`，所以用 `h()` 搭面板，或者渲染一个你已经引入的组件。每次读配置都会重新取值：用 getter 传配置，展开集合要换成新对象，不要原地改。

```ts
const expansion = useTableRowExpansion(() => ({
  expandedKeys: expanded.value,
  onToggle: toggle,
  getRowKey: order => order.id,
  renderExpanded: order => h('p', order.note),
}))
```

折叠按钮那一列的 key 是 `__expansion`，插在你的列前面。宽 40px，表头视觉上留空但保留给读屏，不能拖动改宽。

## 示例

<DemoExample
  :demo="useTableRowExpansionDetail"
  description="每行都能展开一整块详情面板的表格。点折叠按钮，或者右键一行选展开。"
  locale="zh"
  title="useTableRowExpansion — 行详情"
/>

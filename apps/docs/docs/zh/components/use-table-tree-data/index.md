---
layout: component-docs
title: useTableTreeData
outline: false
footer: false
---

<script setup lang="ts">
import { useTableTreeDataTree } from '../../../../components/demos/use-table-tree-data'
</script>

## 使用方法

给表格用的无渲染树插件。树列（默认是第一列）里会按层级缩进，并画出展开/收起的箭头；表体行上会带 `aria-level` 和 `aria-expanded`，把层级关系说出来。它和别的表格插件可以叠着用：约定顺序是树在前、选择在后，这样复选框列就落在缩进过的树列左边。配置可以直接用 `useTableTreeState` 帮你拼好的那份，也可以在服务端驱动或者数据已经拍平的场景自己拼。一行都不可展开时（比如拍平的普通数据），它的每个变换都是原样返回，表格看起来和没装这个插件一样。已知限制：树列里的内容会自动换行，所以 `textOverflow="truncate"` 的提示在树列里不生效。

```ts
import { useTableTreeData } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableTreeDataTree"
  description="子行沿用同样的列，按层级缩进，树列里带展开/收起箭头。表头的开关可以一次展开所有分支。"
  locale="zh"
  title="useTableTreeData —— 树形表格"
/>

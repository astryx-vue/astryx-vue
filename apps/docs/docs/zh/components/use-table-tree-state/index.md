---
layout: component-docs
title: useTableTreeState
outline: false
footer: false
---

<script setup lang="ts">
import { useTableTreeStateTree } from '../../../../components/demos/use-table-tree-state'
</script>

## 使用方法

`useTableTreeData` 的配套状态工具。展开集合由它管（受控或不受控都行），嵌套数据也由它拍平成可见的行。收起的分支是真的不渲染，不是藏起来，所以表体里正好只有看得见的那些行。它会返回 `expandAll` / `collapseAll` 两个方法、给表头全展开开关用的汇总状态 `isAllExpanded`（true/false/indeterminate），以及一个拿来就能用的 `plugin`。注意：收起的行不渲染，所以收起的子树里组件自己的局部状态会丢；需要活下来的状态往上抬。

```ts
import { useTableTreeState } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableTreeStateTree"
  description="嵌套的行被拍平成可见的行，展开集合由这个 hook 管。表头的开关可以一次展开所有分支，点有子行的行也能展开。"
  locale="zh"
  title="useTableTreeState —— 树形表格"
/>

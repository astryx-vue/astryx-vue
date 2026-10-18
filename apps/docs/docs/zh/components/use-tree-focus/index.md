---
layout: component-docs
title: useTreeFocus
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

管理树形控件的 roving tabindex 焦点，以及 WAI-ARIA 树的那套键盘规则。上、下、Home、End 在可见的树节点之间按顺序移动（跳过停用的节点）；右、左带树的语义（展开或收起，去第一个子节点或回父节点）。Enter 和空格激活，直接敲字符会触发 typeahead 跳到以这些字符开头的节点。

打开 `hasRovingTabIndex` 就由这个 hook 管唯一那个 tab 停靠点。不打开就自己管：hook 把焦点移到哪个节点，会通过 `onActiveChange` 告诉你。

```ts
import { useTreeFocus } from '@astryx-vue/core/TreeList'
```

```vue
<script setup lang="ts">
import { useTreeFocus } from '@astryx-vue/core/TreeList'

const { treeRef, handleKeyDown, handleFocus } = useTreeFocus({
  hasRovingTabIndex: true,
  onToggleExpand: id => toggleNode(id),
})
</script>

<template>
  <div ref="treeRef" role="tree" tabindex="-1" @keydown="handleKeyDown" @focus="handleFocus">
    <!-- 树节点 -->
  </div>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在有层级的树形控件里：把 `onToggleExpand` 接到你的展开状态上；tab 停靠点要么交给 `hasRovingTabIndex`，要么自己在 `onActiveChange` 里挪。 |
| <Badge variant="success">推荐</Badge> | 把 `treeRef` 和 `handleKeyDown` 一起绑到 `role="tree"` 的容器上（`ref="treeRef"` 和 `@keydown="handleKeyDown"`）。 |
| <Badge variant="success">推荐</Badge> | 由 hook 管 tab 停靠点时，把 `handleFocus` 接到容器的 `@focus` 上：点完之后靠它对齐。 |
| <Badge variant="error">避免</Badge> | 用在线性列表（改用 `useListFocus`）或二维网格（改用 `useGridRovingFocus`）上；那些遍历方式和树不一样。 |

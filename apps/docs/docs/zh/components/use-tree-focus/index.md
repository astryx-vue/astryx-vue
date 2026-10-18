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

```ts
import { useTreeFocus } from '@astryx-vue/core/TreeList'
```

```vue
<script setup lang="ts">
import { useTreeFocus } from '@astryx-vue/core/TreeList'

const { treeRef, handleKeyDown, handleFocus } = useTreeFocus({
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
| <Badge variant="success">推荐</Badge> | 用在有层级的树形控件里：把 `onToggleExpand` 接到你的展开状态上；那唯一一个 tab 停留点由这个 hook 自己管。 |
| <Badge variant="success">推荐</Badge> | 把 `treeRef` 和 `handleKeyDown` 一起绑到 `role="tree"` 的容器上（`:ref="treeRef"` 和 `@keydown="handleKeyDown"`）。 |
| <Badge variant="success">推荐</Badge> | 把 `handleFocus` 接到容器的 `@focus` 上。点完之后 tab 停留点靠它修回来。 |
| <Badge variant="error">避免</Badge> | 用在线性列表（改用 `useListFocus`）或二维网格（改用 `useGridRovingFocus`）上；那些遍历方式和树不一样。 |

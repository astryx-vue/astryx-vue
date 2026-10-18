---
layout: component-docs
title: useTreeFocus
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Manages roving-tabindex focus and the WAI-ARIA tree keyboard model. ArrowUp/ArrowDown/Home/End roam linearly over the visible treeitems (skipping disabled ones), while ArrowRight/ArrowLeft carry tree semantics (expand/collapse, move to first-child/parent). Enter/Space activate, and printable characters trigger typeahead.

Turn on `hasRovingTabIndex` to let the hook own the single tab stop. Leave it off to keep the tab stop yourself: `onActiveChange` then tells you which item the hook moved focus to.

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
    <!-- treeitems -->
  </div>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for hierarchical tree widgets: wire `onToggleExpand` to your expansion state, and either turn on `hasRovingTabIndex` or move your own tab stop from `onActiveChange`. |
| <Badge variant="success">Do</Badge> | Attach both `treeRef` and `handleKeyDown` to the `role="tree"` container element (`ref="treeRef"` and `@keydown="handleKeyDown"`). |
| <Badge variant="success">Do</Badge> | Attach `handleFocus` to the container's `@focus` when the hook owns the tab stop: that is how it is repaired after a click. |
| <Badge variant="error">Don't</Badge> | Use for linear lists (prefer `useListFocus`) or 2D grids (prefer `useGridRovingFocus`); those traversals differ from a tree. |

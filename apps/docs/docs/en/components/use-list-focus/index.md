---
layout: component-docs
title: useListFocus
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Manages keyboard navigation within a linear list following WAI-ARIA menu, listbox, and toolbar patterns. Supports arrow key navigation (vertical, horizontal, or both), Home/End for boundaries, optional wrap-around, RTL, and Escape to close. Opt into `hasRovingTabIndex` for composite widgets (toolbars, segmented controls, tab strips) that own a single tab stop. Suitable for dropdown menus, toolbars, and any 1D focusable list.

Attach `listRef` to the container, `handleKeyDown` to its keys, and `handleFocus` to its focus event. `handleFocus` is a no-op unless `hasRovingTabIndex` is on, so it is always safe to attach.

```ts
import { useListFocus } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `orientation` to `'horizontal'` for toolbars and tab bars, `'vertical'` for dropdown menus. |
| <Badge variant="success">Do</Badge> | Provide an `onEscape` callback for menus/dropdowns to return focus to the trigger. |
| <Badge variant="success">Do</Badge> | Enable `hasRovingTabIndex` (and `hasCaretGuard` when the widget can contain text inputs) for toolbar-style composites that should be a single tab stop. |
| <Badge variant="error">Don't</Badge> | Use for 2D grid navigation; prefer `useGridRovingFocus` for grids and calendars. |

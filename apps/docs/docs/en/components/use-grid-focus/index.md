---
layout: component-docs
title: useGridFocus
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useGridFocusColorSwatches } from '../../../../components/demos/use-grid-focus'
</script>

## Usage

Manages keyboard navigation within a 2D grid following the WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, and Page Up/Down for custom callbacks (e.g., month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.

```ts
import { useGridFocus } from '@astryx-vue/core'
```

The hook reads the cells out of the DOM, so `gridRef` and `handleKeyDown` go on the grid container. `handleFocus` goes on the container's `focusin` event: a `focus` event does not bubble in the DOM, so `@focus` on the container would never hear the cells.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for calendar date grids: wire `onPageUp` / `onPageDown` to month navigation and `onNavigateBefore` / `onNavigateAfter` for cross-month arrow key navigation. |
| <Badge variant="success">Do</Badge> | Attach both `gridRef` and `handleKeyDown` to the grid container element. |
| <Badge variant="success">Do</Badge> | For roving-tabindex grids (e.g. Calendar), set `hasRovingTabIndex: true` and attach `handleFocus` to the container's `focusin` event; seed one focus target with `tabindex="0"` and the hook repairs and moves it. |
| <Badge variant="error">Don't</Badge> | Use for simple linear lists; prefer `useListFocus` for 1D navigation. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useGridFocusColorSwatches"
  description="A color swatch picker in rows of eight with one Tab stop. useGridFocus moves focus with the arrow keys, Home and End, and Ctrl+Home and Ctrl+End. Each swatch is a button, so Enter or a click picks it."
  locale="en"
  title="useGridFocus — Color Swatch Grid"
/>

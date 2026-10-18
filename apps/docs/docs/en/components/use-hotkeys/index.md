---
layout: component-docs
title: useHotkeys
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Registers global keyboard shortcuts with a single window `keydown` listener per hook instance. The shortcut list is read from a ref or getter, so updating it never re-subscribes. Skips events from typing targets (`input`, `textarea`, `select`, `contenteditable`) unless `allowInInputs`, skips `defaultPrevented` events, skips keys that belong to an IME composition, and calls `preventDefault()` on match. SSR-safe: the listener is only installed on mount.

```ts
import { useHotkeys } from '@astryx-vue/core'
```

The listener is removed when the component unmounts, not when the list changes.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for app-level shortcuts like command palettes (`mod+k`), help overlays (`shift+/`), and navigation keys. |
| <Badge variant="success">Do</Badge> | Pair with the `Kbd` component to display the same combo you register; both resolve `mod` per platform identically. |
| <Badge variant="success">Do</Badge> | Use `isDisabled` to suspend shortcuts while a modal or wizard owns the keyboard, instead of unmounting the hook. |
| <Badge variant="error">Don't</Badge> | Use for focus-scoped keyboard navigation inside a widget; use `useListFocus` or `useGridRovingFocus` instead. |

---
layout: component-docs
title: useScrollLock
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Locks `body` scroll while `isLocked` is true, so the page behind a modal or a dialog stays where it is. `isLocked` is a ref: pass the same flag that opens the overlay, and the hook follows it.

The lock is reference counted. The page is released only when the outermost lock goes away, so closing a sheet that sits inside a dialog does not unlock the page under it. The inline `overflow` that `body` had before is put back when the last lock is released. Where the scrollbar takes space (Windows and Linux desktops, or macOS set to always show scroll bars), its gutter is held open while locked (`scrollbar-gutter: stable`, with padding as the fallback), so neither the page nor its fixed-position chrome jumps sideways, and a scope that goes away releases its own lock. The page is never pinned with `position: fixed`, so its scroll offset does not change. Where the primary pointer is coarse (phones and tablets), iOS Safari scrolls an `overflow: hidden` page under a finger, so a one-finger pan that nothing inside the overlay takes is cancelled (pans a scroller in the overlay can take, a pinch, a zoomed page and a range slider still work), and the page's overscroll bounce is turned off while locked.

```ts
import { useScrollLock } from '@astryx-vue/core'
import { ref } from 'vue'

const isOpen = ref(false)
useScrollLock(isOpen)
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use when opening full-screen modals or dialogs to prevent background content from scrolling. |
| <Badge variant="success">Do</Badge> | Pass the same ref that controls dialog visibility as the `isLocked` argument. |
| <Badge variant="success">Do</Badge> | Keep the call in the scope that owns the overlay. Leaving that scope releases the lock. |
| <Badge variant="error">Don't</Badge> | Use for non-modal overlays like popovers or tooltips; users should be able to scroll away from those. |

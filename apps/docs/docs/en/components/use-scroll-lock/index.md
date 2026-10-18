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

The lock is reference counted. The page is released only when the outermost lock goes away, so closing a sheet that sits inside a dialog does not unlock the page under it. The inline `overflow` that `body` had before is put back when the last lock is released, and a scope that goes away releases its own lock.

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

---
layout: component-docs
title: useEntryAnimation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Returns a class for animating an element on mount. Only animates when the element is dynamically inserted after the initial page paint; elements rendered on page load are not animated. Uses Astryx motion tokens (duration, easing) for consistent animation timing. Nothing animates during server rendering.

```ts
import { useEntryAnimation } from '@astryx-vue/core'
```

Bind the returned `entryClass` next to the element's own classes; Vue merges `class` bindings, so it never replaces them. `entryClass` is `null` when the element should not animate, and a class binding drops `null`, which is exactly the behavior you want. The class carries the shared keyframes from `styles/motion.css`, so duration, easing, and the reduced-motion fallback all come from the theme.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for conditionally rendered elements like validation messages, toasts, or expanding sections. |
| <Badge variant="success">Do</Badge> | Add the returned class next to the element's own classes, so the animation stacks with its styling instead of replacing it. |
| <Badge variant="error">Don't</Badge> | Use for elements that should be visible on initial page load; they will not animate. |

---
layout: component-docs
title: useScrollOverflow
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Tracks scroll overflow state for a horizontally scrollable container. Returns a ref callback and state booleans that update as the user scrolls or the container resizes. Uses scroll event listeners and ResizeObserver for reactive updates. Tolerance of 1px is applied to avoid sub-pixel false positives.

`scrollRef` is a function ref, so bind it with `:ref="scrollRef"`. Give the container `overflow-x: auto` or `overflow-x: scroll`; the hook only reads the edges the container already has.

```ts
import { useScrollOverflow } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useScrollOverflow } from '@astryx-vue/core'

const { hasOverflow, overflowEnd, overflowStart, scrollRef } = useScrollOverflow()
</script>

<template>
  <div class="rail">
    <button :disabled="!overflowStart">
      Back
    </button>
    <div :ref="scrollRef" class="rail-track">
      <slot />
    </div>
    <button :disabled="!overflowEnd">
      More
    </button>
  </div>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use to show/hide scroll navigation buttons or fade edges on carousels and horizontal lists. |
| <Badge variant="success">Do</Badge> | Apply the `scrollRef` to a container with `overflow-x: auto` or `overflow-x: scroll`. |
| <Badge variant="error">Don't</Badge> | Use for vertical scroll tracking; this hook only measures horizontal overflow. |

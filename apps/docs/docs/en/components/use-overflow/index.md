---
layout: component-docs
title: useOverflow
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Measures children rendered in a hidden container to determine how many fit in the available width without flickering. Uses ResizeObserver to react to container and measured-child size changes. The measurement container should hold all items plus an optional overflow indicator element (identified by a `data-overflow-indicator` attribute).

The two containers are template refs here, so bind them with `ref`. `visibleCount`, `rows`, and `rowHeight` are refs you can render right away; `remeasure()` measures again on demand.

```ts
import { useOverflow } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useOverflow } from '@astryx-vue/core'

const items = ['One', 'Two', 'Three', 'Four', 'Five']
const { containerRef, hasOverflow, measureRef, visibleCount } = useOverflow(items.length, { gap: 8 })
</script>

<template>
  <div ref="containerRef" class="row">
    <button v-for="item in items.slice(0, visibleCount)" :key="item">
      {{ item }}
    </button>
    <button v-if="hasOverflow">
      +{{ items.length - visibleCount }} more
    </button>
  </div>

  <div ref="measureRef" class="row" inert>
    <button v-for="item in items" :key="item">
      {{ item }}
    </button>
    <button data-overflow-indicator>
      +{{ items.length }} more
    </button>
  </div>
</template>
```

The measured container is painted out of sight, so every item keeps its real width. Put `inert` on it so it stays out of the tab order and the accessibility tree. The visible container renders `visibleCount` items and an overflow indicator of its own, which is not measured.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Render all items into the `measureRef` container (hidden) and only the first `visibleCount` items into the `containerRef` container (visible). |
| <Badge variant="success">Do</Badge> | Include an overflow indicator (e.g., "+N more" button) as the last child of the measurement container with a `data-overflow-indicator` attribute. |
| <Badge variant="error">Don't</Badge> | Use for vertical overflow; this hook measures horizontal width only. |

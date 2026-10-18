---
layout: component-docs
title: useLayer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLayerAnchored } from '../../../../components/demos/use-layer'
</script>

## Usage

Core positioning hook for rendering overlay content. Use it as the foundation for custom popovers, hover cards, tooltips, and fixed-position layers when the higher-level components are not enough.

```ts
import { useLayer } from '@astryx-vue/core'
```

`context` mode follows an anchor element; `fixed` mode places the layer at explicit `x` / `y` viewport coordinates. The hook owns the open state, the measured coordinates, click-outside dismissal, and the layer ID. It renders nothing: you decide where the layer lives and what it looks like.

```vue
<script setup lang="ts">
import { useLayer } from '@astryx-vue/core'

const layer = useLayer({ mode: 'context', placement: 'below', lightDismiss: true })
</script>

<template>
  <button :ref="layer.anchorRef" type="button" @click="layer.show()">
    Show layer
  </button>
  <Teleport to="body">
    <div
      v-if="layer.isMounted"
      v-show="layer.isOpen"
      :id="layer.id"
      :ref="layer.contentRef"
      :style="layer.contentStyle"
    >
      Anchored layer
    </div>
  </Teleport>
</template>
```

`contentStyle` carries the measured `top` / `left` (plus `position: fixed` in fixed mode), so the surface only needs its own background, radius, and shadow. Positions are measured in the viewport, so render the layer into a `Teleport` — that also keeps it out of ancestor clipping and stacking.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use context mode for anchor-positioned overlays relative to a trigger element, and fixed mode for manually positioned overlays at specific coordinates. |
| <Badge variant="success">Do</Badge> | Build on higher-level components like `Popover`, `HoverCard`, and `Tooltip` for common overlay patterns. |
| <Badge variant="success">Do</Badge> | Render the layer through `Teleport` so it escapes ancestor clipping and stacking, and keep the theme variables it needs available where it lands. |
| <Badge variant="error">Don't</Badge> | Implement ARIA patterns directly in a layer unless you also own the full accessibility behavior. |

## Examples

Low-level anchored overlay rendered with `useLayer` and a custom surface.

<DemoExample
  :demo="useLayerAnchored"
  description="Low-level anchored overlay rendered with useLayer and a custom surface."
  locale="en"
  title="useLayer — Anchored Layer"
/>

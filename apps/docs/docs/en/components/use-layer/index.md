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
import { useLayer, useLayerTeleportTarget } from '@astryx-vue/core'

const layer = useLayer({ mode: 'context', placement: 'below', lightDismiss: true })
// Inside an open Dialog the layer mounts into it; everywhere else, into the body.
const teleportTarget = useLayerTeleportTarget()
</script>

<template>
  <button :ref="layer.anchorRef" type="button" @click="layer.show()">
    Show layer
  </button>
  <Teleport :to="teleportTarget">
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

### Dismissal: one press closes the top layer

Every layer shares one dismissal stack. Escape, and a press outside a layer, close only the top-most layer: with a menu open inside a Dialog, the first Escape closes the menu and leaves the Dialog up, and the second closes the Dialog. A press outside the menu but inside the Dialog closes the menu only.

A press on the layer's own trigger does not count as an outside press — the trigger owns that toggle, so the layer cannot be dismissed and reopened in one click. Escape during an IME composition cancels the composition and dismisses nothing.

A layer that drills into its own sub-levels can handle Escape itself through `useDismiss`'s `onEscape`; an outside press still closes the whole layer.

### Where the layer lands

Layers render into the body by default. An open Dialog is a native modal, so a layer outside it is painted over by the backdrop and cannot be clicked; the Dialog therefore provides its own mount point and layers prefer it. `useLayerTeleportTarget()` returns that target (or `'body'`), ready for `Teleport`.

### Text styles

A teleported layer still inherits the typography of where it was written. Put `astryx-layer` on the layer root and font size, weight, line height, alignment, letter spacing, and wrapping fall back to the body baseline; the container-padding variables are zeroed there too. Our `Popover`, `Tooltip`, `HoverCard`, `DropdownMenu`, `ContextMenu`, `TabMenu`, and `Selector` surfaces already carry these resets.

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

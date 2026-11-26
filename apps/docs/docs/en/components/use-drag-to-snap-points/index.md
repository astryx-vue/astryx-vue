---
layout: component-docs
title: useDragToSnapPoints
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useDragToSnapPointsDrawer } from '../../../../components/demos/use-drag-to-snap-points'
</script>

## Usage

`useDragToSnapPoints` lets a drag move an element along one axis and settles it on snap points when the finger lifts, the way an iOS sheet settles on its detents:

- A slow release settles on the snap point nearest to where it is.
- A quick flick carries to the next snap point in its direction.
- A release while the finger was moving back returns to where it started.

The settle continues the release's velocity, so the motion carries on.

```ts
import { useDragToSnapPoints } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useDragToSnapPoints } from '@astryx-vue/core'
import { ref, useTemplateRef } from 'vue'

const drawer = useTemplateRef<HTMLElement>('drawer')
const settled = ref(0)

const { settleTo } = useDragToSnapPoints(drawer, {
  axis: 'y',
  snapPoints: [0, 240, 480],
  onSettle: (index) => {
    settled.value = index
  },
})
</script>

<template>
  <div ref="drawer">
    Drawer
  </div>
  <button type="button" @click="settleTo(0)">
    Expand
  </button>
</template>
```

`snapPoints` are offsets in px along `axis` from the element's resting position, such as `[0, 240, 480]`, sorted before use (`onSettle` and `settleTo` count in that order). Unlike BottomSheet's `snapPoints`, they are not fractions of the viewport. An empty list makes the drag do nothing and warns in development.

`onSettle` is called with the snap point's index once the element settles on it, and is read on each call. `settleTo(index)` settles the element on the snap point at `index` without a drag: the keyboard and button path.

A new `axis`, `snapPoints` or `flickThreshold` creates the drag again and nothing more: the element stays where it is, a settle in flight included, and the next drag or `settleTo` starts there. A new array with the same snap points is no change. The composable follows the element behind the ref, removes every listener at unmount, and reports nothing after it. Nothing touches the DOM during server rendering.

Outside a component (a plain script), use `createDragToSnapPoints(element, options)`. It takes the same options and returns `{ settleTo, destroy }`; `destroy` removes every listener and stops the element where it is.

```ts
import { createDragToSnapPoints } from '@astryx-vue/core'

const drag = createDragToSnapPoints(element, { axis: 'x', snapPoints: [0, 320], onSettle: index => console.log(index) })
drag.settleTo(1)
drag.destroy()
```

When the person asks for reduced motion, the settle after a touch drag becomes a short cross-fade into the snap point, as does any settle on a device whose primary pointer is coarse, such as a tablet; after a mouse or pen drag elsewhere it lands at once. `settleTo` fades on such a device and lands at once with a fine primary pointer. While the finger is down, the element still follows it.

For a bottom sheet, use BottomSheet's `snapPoints`; for a scrolling row, Carousel's `hasSnap`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Offer the same positions without a drag: buttons or keys that call `settleTo`. |
| <Badge variant="success">Do</Badge> | Keep the settled index in state from `onSettle`, and render what the position means from it. |
| <Badge variant="success">Do</Badge> | When a position changes what the element shows, announce the change. |
| <Badge variant="error">Don't</Badge> | Use it for a sheet or a carousel: their own props already settle the way people expect. |

## Examples

<DemoExample
  :demo="useDragToSnapPointsDrawer"
  description="Drag the panel up or down; on release it settles open, half open or peeking, and a quick flick carries to the next one in its direction. The buttons settle it without a drag."
  locale="en"
  title="useDragToSnapPoints — a three-detent panel"
/>

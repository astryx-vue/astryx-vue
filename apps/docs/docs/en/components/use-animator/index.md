---
layout: component-docs
title: useAnimator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useAnimatorDragCard } from '../../../../components/demos/use-animator'
</script>

## Usage

`useAnimator` drives one element with the springs and momentum the components use. Pass it a template ref and it returns an animator:

- `animate(target, options?)` springs channels to a target on the state-change spring. Without a velocity it carries on from the velocity on screen, so interrupting another animation stays smooth. Pass `velocity`, such as a drag's release velocity, to start from it.
- `decay(velocity)` coasts from a release velocity, slowing as a scroll view's momentum does. There are no bounds; opacity stops at 0 or 1.
- `set(values)` puts channels in place at once: the per-frame write of a drag.
- `get()` and `getVelocity()` read every channel's value and velocity on screen.
- `stop()` halts every channel where it is.

The channels are `x` and `y` (px), `scale` (1 is its size), `rotate` (degrees, clockwise) and `opacity` (0 to 1). Each method acts on the channels it is given and leaves the others where they are. The promises from `animate` and `decay` resolve when the channels arrive, or as soon as a later call takes any of them over.

```ts
import { useAnimator } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useAnimator } from '@astryx-vue/core'
import { useTemplateRef } from 'vue'

const card = useTemplateRef<HTMLElement>('card')
const animator = useAnimator(card)
</script>

<template>
  <div ref="card">
    Card
  </div>
  <button type="button" @click="animator.animate({ scale: 1.2 })">
    Pop
  </button>
</template>
```

The animator is made once, and animating never re-renders the component. It follows the element behind the ref: a node that replaces it starts at rest, and an unmount stops running motion and drops the values. While no element is attached, every call does nothing, and `animate` and `decay` resolve at once. It touches no DOM during server rendering. `target` may also be a getter or an element.

With reduced motion, every call is planned: a move becomes a short cross-fade on a touch screen, and lands at once with a mouse. A release coast keeps its momentum. The springs follow the theme's `motion.tempo`.

Outside a component, use `createAnimator(element)`. It returns the same methods plus `destroy()`, which stops every motion and lets the element go; the animator does nothing after it.

```ts
import { createAnimator } from '@astryx-vue/core'

const animator = createAnimator(element)
await animator.animate({ x: 0, rotate: 0 }, { velocity: { x: -900 } })
animator.destroy()
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Follow a drag with `set`, then hand the measured velocity to `animate` or `decay` on release so the motion carries on. |
| <Badge variant="success">Do</Badge> | Use one animator per element. |
| <Badge variant="error">Don't</Badge> | Drive one element from two animators; they overwrite each other. |
| <Badge variant="error">Don't</Badge> | Use it for plain enter and exit; CSS transitions and the shared `astryx-motion-*` classes are simpler. |

## Examples

<DemoExample
  :demo="useAnimatorDragCard"
  description="Drag the card; on release it springs home from the speed of your hand. The buttons pop, spin, fling it on a momentum coast, and reset it."
  locale="en"
  title="useAnimator — drag and spring back"
/>

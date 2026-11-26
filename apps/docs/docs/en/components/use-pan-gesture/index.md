---
layout: component-docs
title: usePanGesture
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { usePanGestureFollowCard } from '../../../../components/demos/use-pan-gesture'
</script>

## Usage

`usePanGesture` reports a drag on an element as values, for a surface you move yourself: a card that follows the finger, a drawer pulled by its handle. A finger, a mouse and a pen all drive it.

`onPan` is called with `{ state, translation, velocity }` as the drag begins, changes, ends at the release, or is cancelled:

- `state`: `'began'`, `'changed'`, `'ended'` or `'cancelled'`.
- `translation`: the movement since the drag began, in pixels. The travel the drag needed to begin is not part of it, so an element that follows it does not jump.
- `velocity`: in pixels per second. At `'ended'` it is the release velocity (0 when the finger rested before lifting); at `'cancelled'` it is 0.

```ts
import { usePanGesture } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { usePanGesture } from '@astryx-vue/core'
import { useTemplateRef } from 'vue'

const handle = useTemplateRef<HTMLElement>('handle')

usePanGesture(handle, {
  axis: 'y',
  onPan: ({ state, translation, velocity }) => {
    // Follow translation while dragging; hand velocity to the settle on release.
  },
})
</script>

<template>
  <div ref="handle">
    Handle
  </div>
</template>
```

The drag claims its touch at UIKit's 10 pt, as `UIPanGestureRecognizer` does, so a tap stays a tap, and a press or a long press is never reported as a pan.

- With `axis`, only a drag along that axis is reported, and the other component of every value reads 0. A scroll across that axis that starts on the element stays the page's.
- Without it, the pan takes a drag in any direction, so a finger's scroll that starts on the element moves the element instead of the page. A trackpad scroll still scrolls the page.
- A mouse or pen drag that starts on selectable text selects that text, and the pan reports nothing. Give that text `user-select: none`.

The composable creates one pan for the element behind the ref, creates a new one when the ref moves to another node or `axis` changes, and destroys it at unmount. `onPan` is read on each call, so a new function re-creates nothing. A drag in progress at unmount ends without calling `onPan` again. Nothing touches the DOM during server rendering. `target` may also be a getter or the element itself.

Outside a component (a plain script), use `createPanGesture(element, options)`. It takes the same options and returns `{ destroy }`, which removes every listener it added and cancels a drag in progress.

```ts
import { createPanGesture } from '@astryx-vue/core'

const pan = createPanGesture(element, { axis: 'x', onPan: event => console.log(event) })
pan.destroy()
```

The pan moves nothing itself, so Reduce Motion applies to the motion you drive from it. A drag has no keyboard or assistive-technology path of its own: whatever it does needs another way to do it, such as buttons or arrow keys (WCAG 2.5.7). Where a component already offers the behavior, use its prop instead: BottomSheet's `snapPoints`, Carousel's `hasSnap`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Move the element from `translation` added to where it was when the drag began, so it moves with the finger from the moment the drag claims it. |
| <Badge variant="success">Do</Badge> | At `ended`, hand `velocity` to the animation that settles the element, so a flick carries on at the speed it was released. |
| <Badge variant="success">Do</Badge> | Give every drag another way to do the same thing from a keyboard and from assistive technology, such as buttons, arrow keys or a menu. |
| <Badge variant="error">Don't</Badge> | Rebuild what a component's prop already covers: BottomSheet's `snapPoints` for a sheet, Carousel's `hasSnap` for paging. |

## Examples

<DemoExample
  :demo="usePanGestureFollowCard"
  description="Drag the card and it follows your finger; on release it springs home from the speed of your hand. The state of the drag shows below."
  locale="en"
  title="usePanGesture — a card that follows the finger"
/>

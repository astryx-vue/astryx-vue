---
layout: component-docs
title: useSnapPaging
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { carouselSnapPaging } from '../../../../components/demos/carousel'
</script>

## Usage

Gives a [Carousel](/en/components/carousel) iOS paging on native snap's stops: pass the value as `:has-snap="paging"`. Under a finger and on a trackpad swipe, the row follows the gesture, then a flick moves one view, or one item with `{ pages: 'item' }`, and the row rests on an item's start edge. However fast the flick, the row moves at most one page from where the gesture began. A touch catches a page turn in flight, and a still touch then rests the row on the nearest page.

A view page lands on the item start edge nearest one viewport on, and always at least one item on. An item whose stop sits within half a step of the row's end belongs to the end page, so every input, native snap included, rests where the row ends.

A mouse wheel and a mouse drag keep native scrolling and snapping. The edge buttons, the arrow keys, Shift plus the wheel, and the template ref's `scrollNext`, `scrollPrev` and `scrollTo` move the row through the paging, so a touch can catch those moves too. While the paging holds the row, the edge buttons and fades follow the row as it is shown, in the same frame. With reduced motion, a page turn jumps straight to its page.

```ts
import { useSnapPaging } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useSnapPaging } from '@astryx-vue/core'
import { Carousel } from '@astryx-vue/core/Carousel'

const paging = useSnapPaging({ pages: 'item' })
</script>

<template>
  <Carousel :has-snap="paging" label="Photos">
    <!-- cards -->
  </Carousel>
</template>
```

Only a carousel given the value loads the paging code. `options` may be a ref or a getter; a new `pages` applies from the next flick. Carousel keeps the value it first attached.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use it for a row read one view at a time, such as onboarding screens or a photo strip, where a fast flick must not skip past the next view. |
| <Badge variant="success">Do</Badge> | Pass `{ pages: 'item' }` when several items show at once and each flick should move only one of them. |
| <Badge variant="error">Don't</Badge> | Use it for a row people scan quickly; plain `hasSnap` keeps native momentum, which can pass several items in one swipe. |

## Examples

<DemoExample
  :demo="carouselSnapPaging"
  description="Onboarding screens with snap paging. A flick moves one view; the switch makes it move one card."
  locale="en"
  title="useSnapPaging — Onboarding"
/>

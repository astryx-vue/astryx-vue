---
layout: component-docs
title: Carousel
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { carouselCards, carouselSnap } from '../../../../components/demos/carousel'
</script>

## Usage

`Carousel` scrolls a row of items sideways. The root is a `region` with `aria-roledescription="carousel"`. Each direct child is one slide, named `Slide N of M`.

`gap` is a spacing step (`0`, `0.5`, `1`, `1.5`, `2`, `3`, or `4`). `padding` uses the same scale and also sets scroll-padding, so a snap point lines up with the content edge. `hasSnap` snaps each child to the start edge. `hasEdgeFade` masks the edge that still has overflow.

`hasButtons` shows previous and next controls when there is something to scroll. A button that cannot move is hidden and disabled. If that button had focus, focus moves to the other one. `hasLoop` wraps from the last item to the first, and the buttons stay available at both ends while the row overflows. Shift plus the wheel scrolls sideways.

The component exposes `scrollNext`, `scrollPrev`, `scrollTo`, `canScrollNext`, and `canScrollPrev` on the template ref.

```vue
<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Carousel } from '@astryx-vue/core/Carousel'
</script>

<template>
  <Carousel :gap="2" has-snap label="Feature cards" style="max-width: 520px">
    <Card :width="200" :min-height="100">
      Design System
    </Card>
    <Card :width="200" :min-height="100">
      Documentation
    </Card>
  </Carousel>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give the region a `label` that names the set, such as “Feature cards”. |
| <Badge variant="success">Do</Badge> | Give each card a stable width so one scroll step shows a predictable amount. |
| <Badge variant="success">Do</Badge> | Turn on `hasSnap` when a reader should land on an item, not between two items. |
| <Badge variant="error">Don't</Badge> | Put a single short item in a carousel. If it fits, the buttons stay off and the row is just a flex line. |
| <Badge variant="error">Don't</Badge> | Hide the buttons and the edge fade together when the row overflows. One of them has to show that more content is off to the side. |

## Examples


<DemoExample
  :demo="carouselCards"
  description="A horizontally scrollable row of cards with snap scrolling enabled. Use for feature grids, product lists, or any set of cards that overflows the available width. The carousel adds fade edges and navigation buttons automatically."
  locale="en"
  title="Carousel — Cards"
/>

<DemoExample
  :demo="carouselSnap"
  description="Scroll-snap carousel with navigation buttons and team member cards. Each card snaps to the start edge on scroll. Use when items should be viewed one at a time rather than as a continuous strip."
  locale="en"
  title="Carousel — Snap"
/>

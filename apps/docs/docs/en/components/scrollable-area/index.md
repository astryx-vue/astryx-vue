---
layout: component-docs
title: Scrollable Area
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { scrollableAreaInlineRail, scrollableAreaOverscroll, scrollableAreaStickyHeaders, scrollableAreaStickyPassthrough, scrollableAreaTwoAxis } from '../../../../components/demos/scrollable-area'
</script>

## Usage

`ScrollableArea` is a native scroll viewport with an observed content box. It enters the tab order only while a requested axis actually overflows. `label` is required.

```vue
<script setup lang="ts">
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
</script>

<template>
  <ScrollableArea label="Notes" :height="240">
    <p>Long content</p>
  </ScrollableArea>
</template>
```

`axis` is `block` (the default), `inline`, or `both`. The component maps those logical axes through writing mode and direction. `overscroll` is `allow` or `contain`. `stickyContainment` is `whenScrollable` or `always`. Padding props apply to the content box and default to 0. `isFullBleed` lets the viewport escape an ancestor's padding without changing the content padding.

Until overflow is measured, the requested axis uses `overflow: clip`. After a measurement, an overflowing axis uses `auto`. `always` keeps the viewport as a sticky boundary even when the content fits. The tolerance is 1px.

`useScrollableArea` is the same measurement for a viewport and content box you already own. `useScrollOverflow` reports the inline start and end edges of one horizontal scroller.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give every area a short label that names what keyboard users will scroll. |
| <Badge variant="success">Do</Badge> | Keep `overscroll="allow"` unless a nested area should stop the gesture. |
| <Badge variant="error">Don't</Badge> | Wrap it in another overflow container. One viewport should own the scroll. |
| <Badge variant="error">Don't</Badge> | Hide the scrollbar without another way to reach the overflow. |

## Examples

<DemoExample
  :demo="scrollableAreaInlineRail"
  description="axis inline scrolls a row of cards. isFullBleed reaches the card edges, and the content padding keeps the first card aligned with the heading."
  locale="en"
  title="Inline rail"
/>

<DemoExample
  :demo="scrollableAreaOverscroll"
  description="The first nested area lets a gesture continue into the panel. overscroll contain stops the gesture at the second area."
  locale="en"
  title="Overscroll"
/>

<DemoExample
  :demo="scrollableAreaStickyHeaders"
  description="The viewport is the sticky containing block. Section labels pin to the list, and the page heading scrolls away."
  locale="en"
  title="Sticky headers"
/>

<DemoExample
  :demo="scrollableAreaStickyPassthrough"
  description="A fitting area passes sticky ownership outward. stickyContainment always keeps the next label inside its own box."
  locale="en"
  title="Sticky passthrough"
/>

<DemoExample
  :demo="scrollableAreaTwoAxis"
  description="axis both gives the content a max-content inline size, so the board scrolls on both axes."
  locale="en"
  title="Two axes"
/>

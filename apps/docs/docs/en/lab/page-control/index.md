---
title: PageControl
---

# PageControl

A row of page indicators under a paging view, modelled on iOS's UIPageControl: one dot per page, the current one highlighted. A tap or a click to either side of the current dot moves one page that way, and sliding a finger or dragging the mouse across the dots goes straight to the page under the pointer.

Under a finger (any touch device, iOS and Android alike), a row of more than ten pages becomes a fixed-width window whose edge dots shrink to show there is more, and a held finger shows a platter behind the dots. With a mouse a long row is cropped to the control; it holds still while you drag and moves to the current dot when you let go.

<script setup lang="ts">
import { labPageControl } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labPageControl" description="Five pages on top: tap either side or drag across the dots. Fifty pages below: on a phone you see the window and its shrunken edge dots." locale="en" title="Page indicators" /></ClientOnly>

## Import

```ts
import { PageControl } from '@astryx-vue/lab'
```

## Usage

You own the page: bind it with `v-model:page`, counted from 1. Keep the paging view and the control in step both ways: change `page` when the view pages, and page the view when the control asks.

```vue
<script setup lang="ts">
const page = ref(1)
</script>

<template>
  <PageControl v-model:page="page" :total-pages="5" />
</template>
```

A drag asks for a page each time it passes a dot, so a quick sweep can skip pages.

## Motion

| Action | Effect |
| --- | --- |
| Page change under a finger | The old current dot fades out over 250ms (`cubic-bezier(0, 0, 0.58, 1)`); after a tap it fades faster, in 125ms. Every other opacity change switches. |
| Finger held for 155ms | A platter appears behind the dots and the other dots dim; it goes away on release. |
| Current page reaches the window's edge | After 50ms the window slides one slot on UIKit's critically damped spring (response 0.15s), without overshoot; the dots take their new sizes at the same time. |
| Finger dragged past the end | The page keeps moving by itself, faster the further past (0.173 pages per second per point past the edge). |
| Mouse | No platter and no fades; a long row moves to the current dot when you let go. |
| Reduced motion | The current dot switches at once; the held look appears at once and fades over 200ms on release; the window cross-fades and the dots resize at the fade's midpoint. |

These durations and springs are copied from iOS 26 measurements and do not follow the theme's motion variables.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `totalPages` | `number` | required | Number of pages. |
| `page` | `number` | required | Current page, counted from 1. Use with `v-model:page`. |
| `label` | `string` | `undefined` | Accessible name. Defaults to "Page indicators", localized. |
| `hidesForSinglePage` | `boolean` | `false` | Render nothing when there is only one page. |

| Event | Payload | Description |
| --- | --- | --- |
| `update:page` | `(page: number)` | The page, from 1, that a tap, click, drag, arrow key, Home, End or assistive technology asks for. |
| `change` | `(page: number)` | Fires together with `update:page`. |

The control is a horizontal slider (`role="slider"`) announced as "Page 3 of 5". Arrow keys move one page; Home and End go to the first and last page.

## Best practices

- Pair it with a view that pages by swipe, such as onboarding screens: it is mainly for seeing where you are, and only secondarily for moving.
- Keep pages few enough to count at a glance; past ten, under a finger the row stays a fixed width, shows a window of pages and scrolls as the page changes.
- Don't use it for long lists of results (use `Pagination`) or for switching views (use `SegmentedControl` or `TabList`).

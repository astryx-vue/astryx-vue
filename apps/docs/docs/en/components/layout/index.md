---
layout: component-docs
title: Layout
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { layoutCard, layoutContentOnly, layoutContentWidth, layoutDualPanel, layoutFullBleed, layoutSidebar } from '../../../../components/demos/layout'
</script>

## Usage

`Layout` arranges up to five regions: header, start, content, end, and footer. The default slot is the content. The other regions are named slots. `AppShell` owns the page frame; use `Layout` inside a page, a card, or a dialog. Use `HStack` or `VStack` when the content is only a row or a column.

```vue
<script setup lang="ts">
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        Orders
      </LayoutHeader>
    </template>
    <LayoutContent>
      Select an order.
    </LayoutContent>
  </Layout>
</template>
```

`height` is `fill` or `auto`. `fill` stretches to the container and scrolls the content; `auto` grows with the content. `contentWidth` limits the width of the content and centers it. Dividers stay full width. A percentage, `fit-content`, `max-content`, `min-content`, or a bare `var()` uses the constrained width mode. `padding` sets this layout's own outer inset and does not pass to a nested layout. `defaultHasDividers` is the fallback for a header or footer that does not set `hasDivider`.

`LayoutHeader`, `LayoutFooter`, `LayoutContent`, and `LayoutPanel` are the region components. A panel's `width` is pixels when it is a number. Pass `resizable` from `useResizable` when a `ResizeHandle` controls that width.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use Layout when the page or card has a header, a side panel, or a footer that should stay put while the content scrolls. |
| <Badge variant="success">Do</Badge> | Put the scroll on `LayoutContent`. Leave the header and footer outside it. |
| <Badge variant="error">Don't</Badge> | Use Layout as the application frame. Use AppShell for top and side navigation. |
| <Badge variant="error">Don't</Badge> | Draw a panel divider and a resize-handle divider on the same edge. |

## Examples

<DemoExample :demo="layoutCard" description="A card with a header, a scrolling content area, and a footer of actions." locale="en" title="Basic card" />

<DemoExample :demo="layoutContentOnly" description="A card that is only a content area, with no header or footer." locale="en" title="Content only" />

<DemoExample :demo="layoutContentWidth" description="contentWidth constrains and centers the text while the dividers stay full bleed." locale="en" title="Content width" />

<DemoExample :demo="layoutDualPanel" description="A file browser: folders at the start, files in the middle, details at the end." locale="en" title="Dual panel" />

<DemoExample :demo="layoutFullBleed" description="Content runs edge to edge with no padding, for a table or an image." locale="en" title="Full bleed content" />

<DemoExample :demo="layoutSidebar" description="A settings page with a navigation panel, a content area, a header, and a footer." locale="en" title="Sidebar navigation" />

---
layout: component-docs
title: Top Nav Mega Menu Item
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMegaMenuItemBasic } from '../../../../components/demos/top-nav-mega-menu-item'
</script>

## Usage

An individual item inside an TopNavMegaMenu. Renders itself in both desktop (popover grid) and mobile drawer modes via render mode context.

```ts
import { TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
```

One item stands for one destination: a title, an optional description under it, and an optional leading icon. Pass `href` to render a link; leave it out and the item is a `<button type="button">`. The icon comes from an `iconClass` CSS icon class or from the `icon` slot, which wins when both are present.

Items go in the default slot of `TopNavMegaMenu`, next to the optional `featured` slot. Clicking an item closes the menu it sits in. Rendered on its own it still shows the title, description, and icon, but there is no menu around it to close.

## Examples

<DemoExample
  :demo="topNavMegaMenuItemBasic"
  description="Rich link items with an icon, title, and description. Use inside the items slot of a TopNavMegaMenu to describe each destination."
  locale="en"
  title="Basic"
/>

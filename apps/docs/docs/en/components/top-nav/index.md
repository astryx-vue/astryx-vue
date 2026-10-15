---
layout: component-docs
title: Top Nav
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { topNavCentered, topNavEnterprise, topNavLogo, topNavMega, topNavMenu, topNavMenus } from '../../../../components/demos/top-nav'
</script>

## Usage

`TopNav` is the navigation landmark across the top of a page. `heading`, `start`, the default slot, and `center` run from the leading edge, and `end` stays at the trailing edge. `TopNavMenu` opens a menu. `TopNavMegaMenu` opens a larger panel with items and a featured card. Arrow keys move through the items and Escape closes the panel.

Pass `mobileQuery` and, when it matches, the leading and center content moves into `MobileNav`. The bar keeps the heading, the end slot, and the toggle. A slot is not rendered in both places at once.

```vue
<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavMenu } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav mobile-query="(max-width: 800px)">
    <template #heading>
      <TopNavHeading heading="Northwind" href="/" />
    </template>
    <TopNavMenu label="Product" :items="[{ label: 'Analytics', href: '/analytics' }]" />
  </TopNav>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give menu items an `href`. ArrowDown opens, arrows move, Escape closes. |
| <Badge variant="success">Do</Badge> | Use `mobileQuery` on small screens instead of copying the same links into a drawer. |
| <Badge variant="error">Avoid</Badge> | Do not put a form in the mega menu. It is navigation, not a dialog. |

## Examples

<DemoExample :demo="topNavCentered" description="Nav items sit in the center. The heading stays at the start, and actions stay at the end." locale="en" title="Centered navigation" />

<DemoExample :demo="topNavEnterprise" description="Icon-labeled items, search, a notification, and a primary action." locale="en" title="Enterprise dashboard" />

<DemoExample :demo="topNavMenu" description="Hover opens a product menu with icons and descriptions." locale="en" title="Hover menu" />

<DemoExample :demo="topNavMega" description="A full-width mega menu with product items and a featured card." locale="en" title="Mega menu" />

<DemoExample :demo="topNavMenus" description="Several hover menus share one bar and close when the pointer moves to another." locale="en" title="Multiple dropdowns" />

<DemoExample :demo="topNavLogo" description="A product mark sits in front of the heading, with a profile action at the end." locale="en" title="With logo" />

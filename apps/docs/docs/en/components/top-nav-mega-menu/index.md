---
layout: component-docs
title: Top Nav Mega Menu
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMegaMenuOverview } from '../../../../components/demos/top-nav-mega-menu'
import { TopNavMegaMenu } from '@astryx-vue/core/TopNav'
</script>

## Usage

Navigation item that displays a full-width mega menu panel on hover. Uses a slots API with items and featured props. TopNavMegaMenuItem renders itself in both desktop and mobile drawer modes. Supports inline collapsible drawer via render mode context.

```vue
<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem, TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Main navigation">
    <template #heading>
      <TopNavHeading heading="DevTools" href="#home" />
    </template>
    <TopNavItem href="#overview" label="Overview" />
    <TopNavMegaMenu label="Products">
      <TopNavMegaMenuItem title="Deploy" description="Ship to production in seconds" href="#deploy" />
      <TopNavMegaMenuItem title="Documentation" description="Guides, references, and tutorials" href="#documentation" />
      <template #featured>
        <TopNavMegaMenuFeaturedCard
          title="What's New"
          description="Check out our latest features and improvements in the Q2 release."
          link-label="Read the changelog"
          link-href="#changelog"
        />
      </template>
    </TopNavMegaMenu>
  </TopNav>
</template>
```

<ComponentAnatomy />

## Examples

<DemoExample :demo="topNavMegaMenuOverview" title="TopNavMegaMenu — Basic" description="A mega menu trigger inside a TopNav that opens a panel of rich link items. Use when a navigation section has multiple destinations worth describing." locale="en" />

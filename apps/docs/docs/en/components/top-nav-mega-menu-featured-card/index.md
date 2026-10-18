---
layout: component-docs
title: Top Nav Mega Menu Featured Card
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMegaMenuFeaturedCardOverview } from '../../../../components/demos/top-nav-mega-menu-featured-card'
import { TopNavMegaMenuFeaturedCard } from '@astryx-vue/core/TopNav'
</script>

## Usage

Standard featured card for the `TopNavMegaMenu` featured slot. Provides a consistent card with optional image, title, description, and CTA link.

```vue
<script setup lang="ts">
import { TopNavMegaMenuFeaturedCard } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNavMegaMenuFeaturedCard
    title="What's New"
    description="Check out the latest features and improvements in the Q2 release."
    link-label="Read the changelog"
    link-href="#changelog"
  />
</template>
```

`title` is required. `image` renders above the body; without `imageAlt` the image stays decorative, which is usually right because the card already carries a visible title. `linkLabel` and `linkHref` add the action at the bottom of the card, and `linkHref` falls back to `href`. Pass `href` without `linkLabel` to make the whole card one link. Text in the default slot lands under the description.

<ComponentAnatomy />

## Examples

<DemoExample :demo="topNavMegaMenuFeaturedCardOverview" title="TopNavMegaMenuFeaturedCard — Basic" description="A promotional card with a title, description, and call-to-action link. Pass it to the featured slot of a TopNavMegaMenu to highlight announcements." locale="en" />

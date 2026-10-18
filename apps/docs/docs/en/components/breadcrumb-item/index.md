---
layout: component-docs
title: Breadcrumb Item
outline: false
footer: false
---

<script setup lang="ts">
import { breadcrumbItemBasic } from '../../../../components/demos/breadcrumb-item'
</script>

## Usage

BreadcrumbItem represents one destination, action, current location, or sibling-menu trigger inside a Breadcrumbs trail.

Items after the first take their separator from the trail. `href` makes the crumb a link; without an address it is a button, and `isCurrent` turns it into plain text marked `aria-current="page"`. `menu` turns the crumb into a menu trigger for sibling destinations, which is why it and `href` are mutually exclusive.

```vue
<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="#home">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="#settings">
      Settings
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      Profile
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="breadcrumbItemBasic" title="Basic" description="Breadcrumb links inside a Breadcrumbs trail. Ancestor pages get an href; mark the last item with isCurrent to render it as plain text for the current page." locale="en" />

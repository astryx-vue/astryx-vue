---
layout: component-docs
title: Side Nav Heading
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavHeadingBasic } from '../../../../components/demos/side-nav-heading'
</script>

## Usage

Product/suite/account heading with smart interaction boundary logic for links and a menu popover.

Pass it to the `header` slot of a `SideNav`. `icon` goes before the text. `superheading` is the small line above the title and `subheading` the one below, and each line can carry its own link. A `menu` slot turns the text into a popover trigger with a chevron, while a plain `headingHref` with no menu makes the whole heading one link. `end` sits at the trailing edge.

```ts
import { SideNavHeading } from '@astryx-vue/core/SideNav'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="sideNavHeadingBasic" title="Basic" description="A SideNav header with an app icon and a linked title. Pass it to the SideNav header prop to identify the product or workspace at the top of the navigation rail." locale="en" />

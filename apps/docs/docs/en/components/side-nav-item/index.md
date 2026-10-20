---
layout: component-docs
title: Side Nav Item
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavItemBasic } from '../../../../components/demos/side-nav-item'
</script>

## Usage

Navigation item with icon, selected state, optional end content, and nesting support via children.

Put `SideNavItem` elements in the default slot of a `SideNav` or a `SideNavSection`. An item with children becomes a group: the chevron collapses it, and when the item also has an `href` the label navigates while the chevron opens the group. In a collapsed rail an item with children opens its children in a side popover. `end` sits at the trailing edge of the row.

```ts
import { SideNavItem } from '@astryx-vue/core/SideNav'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="sideNavItemBasic" title="Basic" description="Navigation links inside a SideNav, each with a label, an icon, and an href. Mark the item for the current page with isSelected." locale="en" />

---
layout: component-docs
title: Side Nav Collapse Button
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavCollapseButtonBasic } from '../../../../components/demos/side-nav-collapse-button'
</script>

## Usage

Toggle button for sidenav collapse. Place inside SideNav (reads context automatically) or outside it (hand the same controlled collapsible config to both). Renders as an icon-only ghost button by default.

Inside a `SideNav` the button finds the collapse state by itself. Outside it, bind `v-model:is-collapsed`, or pass the same `collapsible` config (`{ isCollapsed, onCollapsedChange }`) to the button and the `SideNav`, so the two stay in step. Pass `label` to turn the icon-only square into a text button.

```ts
import { SideNavCollapseButton } from '@astryx-vue/core/SideNav'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="sideNavCollapseButtonBasic" title="Basic" description="Place a collapse button in the SideNav footer to let users toggle the rail between expanded and collapsed states. Disable the built-in button via collapsible={{hasButton: false}} when positioning it yourself." locale="en" />

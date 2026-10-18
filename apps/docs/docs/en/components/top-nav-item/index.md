---
layout: component-docs
title: Top Nav Item
outline: false
footer: false
---

<script setup lang="ts">
import { topNavItemBasic } from '../../../../components/demos/top-nav-item'
</script>

## Usage

`TopNavItem` is a navigation link item for the `start` slot or the default slot of `TopNav`: it renders as an anchor with hover and selected states.

With `href` set, the item is a link. Without an address, or with `isDisabled`, it renders as a button instead, so it cannot navigate.

```ts
import { TopNavItem } from '@astryx-vue/core/TopNav'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="topNavItemBasic" title="Basic" description="Navigation links inside a TopNav with one item marked as selected. Use for top-level pages of an application." locale="en" />

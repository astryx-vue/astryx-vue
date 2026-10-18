---
layout: component-docs
title: Top Nav Menu
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMenuBasic } from '../../../../components/demos/top-nav-menu'
</script>

## Usage

`TopNavMenu` is a navigation item that shows a hover-triggered popover menu. Its entries are rich: each one carries an icon, a title, and an optional description.

An entry writes its title in `label`, its supporting line in `description`, and its icon class in `iconClass`.

```ts
import { TopNavMenu } from '@astryx-vue/core/TopNav'
```

## Examples

<DemoExample :demo="topNavMenuBasic" description="A dropdown menu inside a TopNav built from an items array with icons and descriptions. Use it to group related destinations under a single trigger." locale="en" title="Basic" />

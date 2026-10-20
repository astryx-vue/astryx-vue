---
layout: component-docs
title: Top Nav Heading
outline: false
footer: false
---

<script setup lang="ts">
import { topNavHeadingBasic } from '../../../../components/demos/top-nav-heading'
</script>

## Usage

Product/suite/account heading for the `TopNav` heading slot. Supports smart interaction boundary logic: logo, heading text, superheading/subheading with independent links, and an optional menu popover with automatic chevron indicator.

```ts
import { TopNavHeading } from '@astryx-vue/core/TopNav'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="topNavHeadingBasic" title="Basic" description="A product heading with a logo inside a TopNav, linked to the home page. Use as the leading brand element of a top navigation bar." locale="en" />

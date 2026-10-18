---
layout: component-docs
title: Side Nav Section
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavSectionBasic } from '../../../../components/demos/side-nav-section'
</script>

## Usage

Section grouping with an optional title, subtitle, and end content.

A section is a named group of `SideNavItem` elements. `subtitle` adds a second, smaller line under the title, and `end` sits at the trailing edge of the header row. While the rail is collapsed the header is only hidden visually, so screen readers still hear the group name. `isHeaderHidden` hides it at any width.

```ts
import { SideNavSection } from '@astryx-vue/core/SideNav'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="sideNavSectionBasic" title="Basic" description="Group related SideNavItems under titled sections. Use sections to organize longer navigation lists into scannable clusters like Overview and Account." locale="en" />

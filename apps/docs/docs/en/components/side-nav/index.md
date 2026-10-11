---
layout: component-docs
title: Side Nav
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sideNavCollapse } from '../../../../components/demos/side-nav'
</script>

## Usage

`SideNav` is the navigation landmark along one side of a page. Compose it with `SideNavSection`, `SideNavHeading`, and `SideNavItem`. With `collapsible`, the bar can shrink to an icon rail and shows a `SideNavCollapseButton`. Items without an icon are omitted while collapsed. Items with children open in a side menu.

Control it with `v-model:is-collapsed`. Pass an object to `collapsible` to hide the built-in button or to set a hotkey such as `mod+\\`.

```vue
<script setup lang="ts">
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <SideNav v-model:is-collapsed="collapsed" collapsible>
    <SideNavSection title="Workspace">
      <SideNavItem href="/home" icon-class="i-carbon-home" label="Home" />
    </SideNavSection>
  </SideNav>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give every collapsible item an icon, or it disappears in the rail. |
| <Badge variant="success">Do</Badge> | Set `href` when a row both navigates and has children. The label navigates; the chevron collapses. |
| <Badge variant="error">Avoid</Badge> | Do not drag to resize. The bar has an expanded width and a collapsed width. |

## Examples

<DemoExample
  :demo="sideNavCollapse"
  description="Use the button at the bottom to collapse the bar. Icon items keep a tooltip, and nested items open to the side."
  locale="en"
  title="Collapse and expand"
/>

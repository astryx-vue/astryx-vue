---
layout: component-docs
title: Layout Panel
outline: false
footer: false
---

<script setup lang="ts">
import { layoutPanelNavigation } from '../../../../components/demos/layout-panel'
</script>

## Usage

Sidebar for navigation, settings, or inspector panels.

```ts
import { LayoutPanel } from '@astryx-vue/core/Layout'
```

`LayoutPanel` is a side region of a `Layout`. It goes in the `start` or `end` slot, keeps its own width, and scrolls independently of `LayoutContent`, so a navigation list or an inspector stays put while the middle of the page moves.

`width` is pixels when it is a number. When a `ResizeHandle` owns the width, pass the `props` from `useResizable` to `resizable` instead and the panel follows the drag. `hasDivider` draws the edge that faces the content; do not draw it when a resize handle already draws a line on that same edge. `isScrollable` is on by default; turn it off when the panel should only grow with its content.

```vue
<script setup lang="ts">
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <Layout>
    <template #start>
      <LayoutPanel :width="200" role="navigation" label="Sections">
        <List>
          <ListItem is-selected label="Overview" />
          <ListItem label="Analytics" />
          <ListItem label="Settings" />
        </List>
      </LayoutPanel>
    </template>
    <LayoutContent>
      Panel content goes here.
    </LayoutContent>
  </Layout>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="layoutPanelNavigation" title="Navigation" description="A fixed-width side panel holding a navigation list next to the main content. Use LayoutPanel in the start or end slot of Layout for sidebars." locale="en" />

---
layout: component-docs
title: Layout Content
outline: false
footer: false
---

<script setup lang="ts">
import { layoutContentBasic } from '../../../../components/demos/layout-content'
</script>

## Usage

Scrollable main content area.

```ts
import { LayoutContent } from '@astryx-vue/core/Layout'
```

`LayoutContent` takes the space a `Layout` has left over between its header, its footer, and its panels, applies the region padding, and scrolls its own content once that content is taller than the space it was given. The header and the footer stay where they are.

`isScrollable` is on by default. Turn it off when the page scrolls as a whole and this region should only grow with its content. `padding` overrides the padding the surrounding `Layout` passes down, and `padding: 0` makes the region full bleed. `label` and `role` give the region a landmark role, so it shows up in a screen reader's landmark list.

```vue
<script setup lang="ts">
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        Orders
      </LayoutHeader>
    </template>
    <LayoutContent>
      Select an order.
    </LayoutContent>
  </Layout>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="layoutContentBasic" title="Basic" description="A scrollable main content area below a fixed header. Use LayoutContent inside Layout to get automatic padding and scroll containment for the primary content." locale="en" />

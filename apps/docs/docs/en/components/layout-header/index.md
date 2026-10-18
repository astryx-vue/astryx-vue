---
layout: component-docs
title: Layout Header
outline: false
footer: false
---

<script setup lang="ts">
import { layoutHeaderWithActions } from '../../../../components/demos/layout-header'
</script>

## Usage

Top bar for page titles, app bars, and toolbars.

```ts
import { LayoutHeader } from '@astryx-vue/core/Layout'
```

`LayoutHeader` is the fixed top region of a `Layout`. It keeps its height while `LayoutContent` scrolls underneath, so a title, a breadcrumb, or a row of actions stays reachable.

`height` is a number of pixels or any CSS length. `padding` sets the region inset, and `paddingBlockEnd` changes only the bottom edge, which is how a tab underline or a divider reaches the header's own edge. `hasDivider` draws the bottom rule; leave it out and the header follows `defaultHasDividers` on the parent `Layout`.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <HStack :gap="2" h-align="between" align="center">
          <Heading :level="4">
            Dashboard
          </Heading>
          <Button label="New Item" variant="primary" />
        </HStack>
      </LayoutHeader>
    </template>
    <LayoutContent>
      Select a report.
    </LayoutContent>
  </Layout>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="layoutHeaderWithActions" title="With actions" description="A fixed page header with a title and a primary action, above scrollable content. Use LayoutHeader inside Layout for persistent page-level headers." locale="en" />

---
layout: component-docs
title: Layout Footer
outline: false
footer: false
---

<script setup lang="ts">
import { layoutFooterActions } from '../../../../components/demos/layout-footer'
</script>

## Usage

Bottom bar for action bars, pagination, and status bars.

```ts
import { LayoutFooter } from '@astryx-vue/core/Layout'
```

`LayoutFooter` is the fixed bottom region of a `Layout`. The content above it scrolls, the footer does not, so a bar of buttons, a page count, or a status line stays in place.

`height` is a number of pixels or any CSS length. `padding` sets the region inset. `hasDivider` draws the top rule; leave it out and the footer follows `defaultHasDividers` on the parent `Layout`.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
    <LayoutContent>
      Order details.
    </LayoutContent>
    <template #footer>
      <LayoutFooter has-divider>
        <HStack :gap="2" h-align="end">
          <Button label="Cancel" variant="secondary" />
          <Button label="Save" variant="primary" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="layoutFooterActions" title="Actions" description="A fixed footer with end-aligned action buttons below scrollable content. Use LayoutFooter inside Layout for persistent actions like Save and Cancel." locale="en" />

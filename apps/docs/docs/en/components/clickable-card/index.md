---
layout: component-docs
title: Clickable Card
outline: false
footer: false
---

<script setup lang="ts">
import { clickableCardElevated, clickableCardNested } from '../../../../components/demos/clickable-card'
</script>

## Usage

`ClickableCard` is a card whose whole surface activates one action. The keyboard stop is a visually hidden link when `href` is set, and a button otherwise. Nested buttons and links keep their own clicks.

```vue
<script setup lang="ts">
import { ClickableCard } from '@astryx-vue/core/ClickableCard'
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <ClickableCard href="/settings" label="Settings">
    <Heading :level="4">
      Settings
    </Heading>
  </ClickableCard>
</template>
```

`target="_blank"` opens `href` in a new tab. Modifier clicks and the middle button do the same. `elevation` and `variant` are forwarded to `Card`.

## Examples

<DemoExample :demo="clickableCardElevated" description="Quarterly report, raised with a medium shadow." locale="en" title="Elevated" />
<DemoExample :demo="clickableCardNested" description="Wireless Headphones. Add to cart is its own button." locale="en" title="Nested button" />

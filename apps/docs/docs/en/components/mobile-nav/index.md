---
layout: component-docs
title: Mobile Nav
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { mobileNavDrawer } from '../../../../components/demos/mobile-nav'
</script>

## Usage

`MobileNav` is a dialog drawer that slides in from one side of the screen, not a bottom sheet. Bind `MobileNavToggle` to the same `v-model:is-open`. While open, focus stays in the drawer. Escape or a press on the scrim closes it and returns focus to where it was.

`side` is `start`, `end`, or `auto`. `auto` picks the side from where focus was when the drawer opened. The top nav creates this pair for you when its media query matches.

```vue
<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MobileNavToggle v-model:is-open="open" controls="app-nav" />
  <MobileNav id="app-nav" v-model:is-open="open" header="Menu" side="start">
    <!-- items -->
  </MobileNav>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Point the toggle `controls` at the drawer id so the button and dialog are related. |
| <Badge variant="success">Do</Badge> | Put ordinary links in the drawer. Do not wrap them in another <code>role="menu"</code>. |
| <Badge variant="error">Avoid</Badge> | Do not use a bottom sheet for this navigation. It is a side drawer. |

## Examples

<DemoExample
  :demo="mobileNavDrawer"
  description="The toggle opens a drawer from the start edge. Escape, the close button, or the scrim dismisses it."
  locale="en"
  title="Side drawer"
/>

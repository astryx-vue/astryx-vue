---
layout: component-docs
title: Drawer
outline: false
footer: false
---

<script setup lang="ts">
import { drawerNonModal, drawerOverview } from '../../../../components/demos/drawer'
</script>

## Usage

`Drawer` is a panel that slides in from one side of the screen, for filters, details, or a short form. By default it has a scrim and is modal: page scrolling is locked, focus stays inside, and closing returns focus to whatever opened it.

`placement` picks the edge, `end` by default. On close the panel slides out the side it came in from; a `placement` change while open takes effect on the next open. `purpose` decides how it closes: `info` allows Escape and a scrim click, `form` allows only Escape, `required` allows neither.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Drawer, DrawerHeader } from '@astryx-vue/core/Drawer'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button @click="isOpen = true">
    Open filters
  </Button>
  <Drawer :is-open="isOpen" label="Filters" @open-change="isOpen = $event">
    <DrawerHeader title="Filters" subtitle="Narrow the list" @open-change="isOpen = false" />
    <p>Category, price range and availability go here.</p>
  </Drawer>
</template>
```

<drawerOverview />

## Without a scrim

Pass `:has-scrim="false"` for a non-modal drawer: no scrim, no scroll lock, and focus is not trapped, so the page beside it stays clickable and scrolls under a finger. Focus still moves into the panel on open, and a keyboard-opened first control shows its tooltip. Escape still closes it, unless `purpose` is `required`. With no scrim to click, include a visible close button.

```vue
<Drawer :is-open="isOpen" label="Details" :has-scrim="false" @open-change="isOpen = $event">
  <DrawerHeader title="Details" has-close-button @open-change="isOpen = $event" />
  <p>The page beside it stays usable.</p>
</Drawer>
```

<drawerNonModal />

With or without a scrim, a drawer that unmounts while open (a route change, say) returns focus to its opener, unless focus has already moved elsewhere on the page.

## Title row

`DrawerHeader` gives you a title, a subtitle, and start/end slots. The close button appears when someone listens for `open-change`; pass `has-close-button` to decide it yourself.

::: tip Drawer or dialog?
Use a drawer when the page stays put and the user is peeking at detail. Use a dialog when the answer blocks progress. For long content rising from the bottom, use `BottomSheet`.
:::

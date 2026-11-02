---
layout: component-docs
title: Drawer
outline: false
footer: false
---

<script setup lang="ts">
import { drawerOverview } from '../../../../components/demos/drawer'
</script>

## Usage

`Drawer` is a panel that slides in from one side of the screen, for filters, details, or a short form. It shares the dialog's modal machinery: page scrolling is locked, focus stays inside, and closing returns focus to whatever opened it.

`placement` picks the edge, `end` by default. `purpose` decides how it closes: `info` allows Escape and a scrim click, `form` allows only Escape, `required` allows neither.

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
  <Drawer v-model:is-open="isOpen" label="Filters">
    <DrawerHeader title="Filters" subtitle="Narrow the list" @open-change="isOpen = false" />
    <p>Category, price range and availability go here.</p>
  </Drawer>
</template>
```

<drawerOverview />

## Title row

`DrawerHeader` gives you a title, a subtitle, and start/end slots. The close button appears when someone listens for `open-change`; pass `has-close-button` to decide it yourself.

::: tip Drawer or dialog?
Use a drawer when the page stays put and the user is peeking at detail. Use a dialog when the answer blocks progress. For long content rising from the bottom, use `BottomSheet`.
:::

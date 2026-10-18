---
layout: component-docs
title: useLongPress
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Detects a single-finger press-and-hold and reports where it happened, so touch users can reach affordances that a pointer gets from right-click. iOS Safari never synthesizes a `contextmenu` event on long-press, which makes this the only touch route into a cursor-positioned surface such as `ContextMenu`. The press cancels on movement, lift, multi-touch or unmount.

The hook attaches no listeners itself. Two ways to bind it: spread the returned `handlers` onto the element (`<div v-on="longPress.handlers">`), or drive it yourself with `start(point)` on `pointerdown`, `moveTo(point)` on `pointermove`, and `cancel` on `pointerup` and `pointercancel`. `ContextMenu` wires the second form on its trigger, and skips mouse pointers so a right-click keeps its own path.

```ts
import { useLongPress } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useLongPress } from '@astryx-vue/core'
import { ref } from 'vue'

const isDisabled = ref(false)

const longPress = useLongPress({
  disabled: isDisabled,
  onLongPress: (point) => { openMenuAt(point.x, point.y) },
})
</script>

<template>
  <button type="button" v-on="longPress.handlers">
    Hold me
  </button>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the reported point to position the surface you open, so it appears under the finger. |
| <Badge variant="success">Do</Badge> | Pair it with the pointer `contextmenu` handler rather than replacing it; this hook only covers touch. |
| <Badge variant="error">Don't</Badge> | Use it for the primary action of a control; press-and-hold is undiscoverable as the only way to do something. |

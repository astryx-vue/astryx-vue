---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

The touch press model every Astryx pressable uses, for a local component that paints its own press. Under a finger, CSS `:active` paints on the touch itself and can outlive the start of a scroll; the press model instead waits 150 ms before believing a press, cancels it the moment the finger travels 10 px or a scroll claims the gesture, never brings it back inside that gesture, answers a quick tap at the lift, and fades the release over 200 ms — the clocks a native list uses. One document-level controller does this for every marked element (installed by the first pressable to mount, removed by the last to unmount), so calling the hook adds no listener or state to your element. Under a mouse nothing changes: keep your `:active` rule, and drop it under `@media (pointer: coarse)` the way the built-in components do.

```ts
import { usePressFeedback } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { usePressFeedback } from '@astryx-vue/core'

const { pressableProps } = usePressFeedback()
</script>

<template>
  <button type="button" class="card" v-bind="pressableProps">
    Press me
  </button>
</template>
```

The hook brings `styles/pressable.css` along. The default `astryx-pressable` class paints the pressed token on a `::after` layer, keeps `:active` for a mouse, and under a finger reads the `data-astryx-press` attribute the controller writes (`on` while held, `fading` for the release). The press's strength is the registered `--astryx-press-alpha`; the release animates it from 1 to 0. A component that paints its own press passes `{ hasOverlay: false }` and paints both `[data-astryx-press]` states from `var(--_press-paint-image)` in its own styles.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Spread the result on the element whose background paints the press, and use `--astryx-color-overlay-pressed` to theme it. |
| <Badge variant="success">Do</Badge> | Let the shipped style own the press on every pointer: it keeps `:active` for a mouse and drops it under `@media (pointer: coarse)`, so a finger sees only the press model. A rule of your own that paints `:active` would paint under a finger too, on the touch and through a scroll. |
| <Badge variant="error">Don't</Badge> | Add a pointer listener or component state to the element to track the press; the controller already writes the attribute, and per-element listeners are what a long list cannot afford. |
| <Badge variant="error">Don't</Badge> | Call it for a control rendered by an Astryx component; those are marked already, and the innermost marked element takes the press. |

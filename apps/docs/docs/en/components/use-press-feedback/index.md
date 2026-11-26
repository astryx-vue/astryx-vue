---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { usePressFeedbackPressableCard } from '../../../../components/demos/use-press-feedback'
</script>

## Usage

The touch press model every Astryx pressable uses, for a local component that paints its own press. Under a finger, CSS `:active` paints on the touch itself and can outlive the start of a scroll; the press model instead tracks the touch the way a native control does: outside a scroll view it highlights in the frame the finger lands; inside one it waits 150 ms, counted from the touch itself so a busy page does not delay it further, so a flick paints nothing. It cancels the moment the finger travels 10 px or a scroll claims the gesture, never brings it back inside that gesture, answers a quick tap at the lift, and fades the release on the theme's exit duration (`--astryx-duration-exit`), at most 200 ms under reduced motion. One document-level controller does this for every marked element (installed by the first pressable to mount, removed by the last to unmount), so calling the hook adds no listener or state to your element. Under a mouse nothing changes: keep your `:active` rule, and drop it under `@media (pointer: coarse)` the way the built-in components do.

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

A container that holds other buttons or inputs, such as a list row or a card, passes `{ isContainer: true }`: a finger pressing one of those controls does not run the container's own action, so the container shows no press. Spread the returned `pressActionProps` on the container's own action element (such as a row's invisible link) so a press on it still presses the container.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Spread the result on the element whose background paints the press, and use `--astryx-color-overlay-pressed` to theme it. |
| <Badge variant="success">Do</Badge> | Let the shipped style own the press on every pointer: it keeps `:active` for a mouse and drops it under `@media (pointer: coarse)`, so a finger sees only the press model. A rule of your own that paints `:active` would paint under a finger too, on the touch and through a scroll. |
| <Badge variant="error">Don't</Badge> | Add a pointer listener or component state to the element to track the press; the controller already writes the attribute, and per-element listeners are what a long list cannot afford. |
| <Badge variant="error">Don't</Badge> | Call it for a control rendered by an Astryx component; those are marked already, and the innermost marked element takes the press. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="usePressFeedbackPressableCard"
  description="A Card made pressable with usePressFeedback: the returned pressableProps go straight on the Card, so a press darkens the card the way every Astryx pressable does; a focus-visible outline gives it the shared focus ring for keyboard focus; and a click, Enter or Space flips it."
  locale="en"
  title="usePressFeedback — Pressable Card"
/>

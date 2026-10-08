---
layout: component-docs
title: Overlay
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overlayBasic, overlayHover, overlayPositions, overlayScrim } from '../../../../components/demos/overlay'
</script>

## Usage

`Overlay` lays one piece of content on top of another bounded piece — a photo, a video, a card, any block that owns its own edges — with a scrim between them that darkens or lightens what is underneath so the content on top stays readable. The content is usually a single action or a single label: a quick view button over a gallery thumbnail, a play button over a video poster, a title over a cover image.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
</script>

<template>
  <Overlay>
    <img src="/fjord.jpg" alt="Fjord at dusk">
    <template #content>
      <Button label="Quick view" size="sm" variant="secondary" />
    </template>
  </Overlay>
</template>
```

The default slot is the base content and the `content` slot is what goes on top; without a `content` slot only the base content renders and no scrim appears. The scrim is dark by default, and it does more than paint a background: everything inside it switches to the dark surface theme, so text, icons, and buttons pick up the colors that belong on a dark surface. You do not write any white text yourself. `scrim="light"` does the same for a light scrim, and `scrim={false}` drops the background entirely while keeping the overlay content and its placement.

There are three ways to decide when the overlay shows. `showOn` is pure CSS: `always`, the default, keeps it visible; `hover` shows it while the pointer is over the surface; `focus` shows it only while something inside the surface holds focus. `isOpen` is controlled from JavaScript and wins over both, bound with `v-model:isOpen`:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Overlay v-model:is-open="isOpen">
    <img src="/fjord.jpg" alt="Fjord at dusk">
    <template #content>
      <Button label="Close" size="sm" variant="secondary" @click="isOpen = false" />
    </template>
  </Overlay>
</template>
```

In hover mode, keyboard focus inside the surface reveals the overlay as well, so a keyboard-only user still reaches the action, and it settles back once focus leaves. A touch device has no hover to follow, so that mode becomes tap-to-toggle: one tap on the base content opens the overlay, another closes it. A tap that lands on a button or a link that was already inside the surface belongs to that element and does not toggle anything.

`position` decides how much of the surface the scrim covers. `fill` covers all of it, while `bottom` and `top` are strips pinned to one edge that slide in from that edge and slide back out. `align` places the content inside the scrim: `start` at the leading edge, `end` at the trailing edge, `center` on both axes.

The container copies the border radius of the base content and clips the scrim with the same radius, so the scrim never covers a rounded corner. An `Overlay` is a covering layer that belongs to its own content, not a floating layer over the page: reach for `Popover` when the surface is anchored to a trigger, and for `Dialog` when the user must answer before continuing.

When the container already exists and only the behavior is missing, use `useOverlay` directly. It returns the attributes for the container and the `OverlayScrim` to render inside it:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { OverlayScrim, useOverlay } from '@astryx-vue/core/Overlay'

const { containerRef, containerProps, scrimProps } = useOverlay({ showOn: 'hover' })
</script>

<template>
  <div ref="containerRef" v-bind="containerProps">
    <img src="/fjord.jpg" alt="Fjord at dusk">
    <OverlayScrim v-bind="scrimProps">
      <Button label="Quick view" size="sm" variant="secondary" />
    </OverlayScrim>
  </div>
</template>
```

The container needs both `containerProps` — which bring the positioning, the clipping, and the tap toggle — and `containerRef`, and the scrim has to render inside that container for the hover and focus selectors to find it. The returned state is reactive: pass a `ref` or a `computed` for options such as `showOn` and `isOpen` and the scrim follows them, while plain values are read once at setup.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep it to the actions and labels that belong to this content: quick view, play, a cover title. |
| <Badge variant="success">Do</Badge> | Keep the overlay content short. The more you place on the scrim, the less of the base surface reads and the harder the text is to read. |
| <Badge variant="success">Do</Badge> | Use `showOn="hover"` when keyboard users need the overlay too: it answers to focus as well as to the pointer. |
| <Badge variant="success">Do</Badge> | Pick the scrim from what is underneath, not from the page theme. A dark photo wants a dark scrim, a bright one wants a light scrim. |
| <Badge variant="error">Don't</Badge> | Put content the user must answer before continuing on it. That belongs in a `Dialog`. |
| <Badge variant="error">Don't</Badge> | Pour long text or a multi-field form onto the scrim. The room over a surface is sized for one line or one button. |
| <Badge variant="error">Don't</Badge> | Use it as a floating layer anchored to a trigger. `Popover`, `Tooltip`, and `Dialog` are the tools for that. |

## Examples

<DemoExample
  :demo="overlayBasic"
  description="A dark scrim laid over the base surface, with a single action on top. The content inside the scrim switches to the dark surface theme, so it stays legible without any hand-written color."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="overlayScrim"
  description="The same surface with a dark scrim, a light scrim, and no scrim at all. The scrim describes what is underneath, not the page theme."
  locale="en"
  title="Scrim modes"
/>

<DemoExample
  :demo="overlayPositions"
  description="fill covers the whole surface, while bottom and top are strips pinned to an edge that slide in from that edge. align moves the content along the strip."
  locale="en"
  title="Coverage and alignment"
/>

<DemoExample
  :demo="overlayHover"
  description="showOn=&quot;hover&quot; keeps the overlay out of the way until the surface is hovered, and reveals it as well when focus enters the surface, so keyboard users reach the action too."
  locale="en"
  title="Revealed on hover or focus"
/>

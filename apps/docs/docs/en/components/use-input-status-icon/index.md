---
layout: component-docs
title: useInputStatusIcon
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Builds the on-field status affordance for a bordered input, so every input in the family behaves the same for a given status. The attached variant renders a plain glyph and leaves the text to the message box; the detached variant renders nothing here, because the message box already carries its own icon; the tooltip variant renders a real focusable button whose tooltip is reachable by keyboard, pointer, touch and assistive tech. Use it when building a bordered input, not for field-level messaging.

```ts
import { useInputStatusIcon } from '@astryx-vue/core'
```

`statusIcon` is a component and `statusIconProps` are its props, so the pair renders as `<component :is="statusIcon" v-bind="statusIconProps" />` inside the input container.

The accessibility wiring stays with `Field` in this port: it already renders the status message as visually hidden text and puts it in the input's `aria-describedby`, and the info-tip button references its own tooltip, so the hook does not return an id of its own.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Render `statusIcon` inside the input container with `statusIconProps`. |
| <Badge variant="success">Do</Badge> | Let it decide when nothing should render; pass `isInGroup` and `statusVariant` through rather than branching at the call site. |
| <Badge variant="error">Don't</Badge> | Use it to convey the status by icon alone; the tooltip variant is the only one that carries the message, so the others still need a message box. |

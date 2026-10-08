---
layout: component-docs
title: Hover Card
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { hoverCardBasic, hoverCardControlled, hoverCardPlacements } from '../../../../components/demos/hover-card'
</script>

## Usage

`HoverCard` opens a card of richer content when the pointer hovers the trigger or keyboard focus lands on it. It differs from `Tooltip` in what it carries: a tooltip holds a line of plain text, while a hover card can hold an avatar, a name, a short bio, and action buttons. Use it for user profiles, link previews, and inline definitions.

Showing waits 300 milliseconds by default, so a pointer passing across the trigger does not flash the card. Hiding waits 200 milliseconds and is cancelled when the pointer enters the card, so the user can travel from the trigger into the card and keep reading or clicking without it vanishing on the way.

The trigger goes in the default slot and the card content goes in the `content` slot:

```vue
<script setup lang="ts">
import { HoverCard } from '@astryx-vue/core/HoverCard'
</script>

<template>
  <HoverCard label="Dana Whitfield">
    Dana Whitfield
    <template #content>
      <p>Design systems engineer, Amsterdam.</p>
    </template>
  </HoverCard>
</template>
```

When the trigger is plain text the component gives it a dashed underline and makes it focusable, so a keyboard user can open the card with Tab. When the trigger is an element such as a button or link, the component listens on that element and writes `aria-haspopup` and `aria-controls` onto it. Passing `label` exposes the card to assistive technology as a named `role="dialog"`; without it the card is a `role="group"` linked to the trigger by `aria-describedby`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the card supplementary: understanding improves with it, but the task is still completable without it. |
| <Badge variant="success">Do</Badge> | Use plain text as the trigger so the dashed underline and keyboard focus work by default; users then see that it is hoverable. |
| <Badge variant="success">Do</Badge> | Pass `label` for content such as a profile, so the card enters the assistive-technology reading order as a named dialog. |
| <Badge variant="success">Do</Badge> | Leave `touchTrigger` on `auto`: a trigger that does nothing on its own opens on a tap, while a button or link keeps its tap. |
| <Badge variant="error">Don't</Badge> | Put critical actions or required information only inside the card; it disappears as soon as the pointer leaves. |
| <Badge variant="error">Don't</Badge> | Use a hover card where a tooltip or popover would do. A one-line hint belongs in `Tooltip`, and content the user must confirm belongs in `Popover`. |
| <Badge variant="error">Don't</Badge> | Put a long form inside the card. The pointer leaving closes it; that content belongs in a dialog. |
| <Badge variant="error">Don't</Badge> | Place it directly inside a `<p>`, a heading, or a link. Those placements work, but the layer's relationship to the document flow becomes hard to predict, so prefer a block context. |

## Examples

<DemoExample :demo="hoverCardBasic" title="Basic" description="Hover or focus the link and the card appears after a short delay, staying open once the pointer moves into it." locale="en" />

<DemoExample :demo="hoverCardPlacements" title="Placements" description="placement sets the side of the trigger; the card flips to the other side when there is no room." locale="en" />

<DemoExample :demo="hoverCardControlled" title="Controlled" description="Pass isOpen to control visibility. Hover and focus stop applying, and Escape only emits openChange(false)." locale="en" />

## Accessibility

The hover card is a separate layer, and the component relates it to the trigger with ARIA attributes so assistive technology can both learn that the trigger carries extra context and read the structure and controls inside the open card:

- The card has `role="group"`; with `label` it becomes a named `role="dialog"`, because an unnamed dialog is invalid while an unnamed group is not.
- Without `label`, the trigger carries `aria-describedby` pointing at the card.
- With `label`, the trigger carries `aria-haspopup="dialog"` instead, plus `aria-controls` while the card is open. `aria-expanded` is only written when the trigger's own role allows it; a plain-text `<span>` trigger has no such role, so it never gets the attribute.
- Attributes the trigger already carried — `aria-haspopup`, `aria-controls`, `aria-expanded`, `aria-describedby` — are preserved and restored when the component unmounts.

The keyboard path is complete: focusing the trigger opens the card immediately, and moving focus between the trigger and the card keeps it open. Pressing Escape while the card is showing closes it; if focus was inside the card it returns to the trigger, and that refocus does not reopen the card. In the controlled mode Escape only emits `openChange(false)` and the parent decides whether to close.

A touch screen has no hover, so `touchTrigger` decides what a tap does. The default `auto` opens the card on a tap of a trigger that performs no action of its own, and leaves the tap to buttons, links, and form controls; once open, a tap outside the card dismisses it. Because the content appears only briefly, keep information a user must see to complete a task out of the card.

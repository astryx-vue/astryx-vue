---
layout: component-docs
title: InfoTip
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { infoTipFieldLabel, infoTipSizes } from '../../../../components/demos/info-tip'
</script>

## Usage

`InfoTip` is a small "i" button that reveals help. Hover and keyboard focus preview the help. A click, tap, Enter, or Space pins it open until Escape, a second press, a press outside, or focus leaving. Put it next to labels, values, and metrics for permission notes, metric definitions, and field help.

```vue
<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
</script>

<template>
  <InfoTip content="Editors can change this field; viewers cannot." />
  <InfoTip content="30-day rolling average." label="About this metric" />
</template>
```

The button is a `useTooltip` toggle: it calls the hook's `show()` and `hide()`, and the hook previews, holds, announces, and closes the help. The info icon is the built-in `info` glyph, so a theme can replace it. Host `data-*` attributes and `class` reach the button; its name and disclosure attributes stay component-owned.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the content concise, plain, and non-interactive; use Popover or HoverCard for links and buttons. |
| <Badge variant="success">Do</Badge> | Override `label` when "More information" is too generic, for example "About this metric". |
| <Badge variant="success">Do</Badge> | Rely on InfoTip rather than a hand-rolled info button on touch: it pins its help on a press, so a tap pins the help though the trigger is a button, and a tap outside closes it. |
| <Badge variant="error">Don't</Badge> | Hand-compose an `Icon` inside `Tooltip` for an info affordance; the bare icon is `aria-hidden` and unfocusable, so keyboard and screen-reader users never reach it. |
| <Badge variant="error">Don't</Badge> | Use InfoTip for information users must see to complete a task; put that text inline instead. |

## Examples

<DemoExample :demo="infoTipSizes" title="Sizes" description="xsm, sm (default), md, and lg map one to one to the Icon sizes: 12, 16, 20, and 24px." locale="en" />

<DemoExample :demo="infoTipFieldLabel" title="Field label" description="`labelTooltip` on any field draws an InfoTip beside the label, named “About Workspace name”." locale="en" />

## Accessibility

- The trigger is one real `<button type="button">`, reachable with Tab, named by `label` (default "More information").
- It follows the toggletip pattern: `aria-expanded="true"` while the help is pinned, `aria-controls` points at the bubble while it shows, and `aria-describedby` keeps the bubble as its description.
- A screen reader hears the help once when it pins. A hover or focus preview is already the button's description, so it is not announced again.
- Escape closes the help through the shared dismissal stack: one press never closes both the help and an enclosing Dialog.
- A press stops at the button, so a clickable row, card, or label around it does nothing.
- On touch, the button has an invisible hit band that grows the tap target.

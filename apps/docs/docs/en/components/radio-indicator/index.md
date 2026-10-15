---
layout: component-docs
title: Radio Indicator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { radioIndicatorStates } from '../../../../components/demos/radio-indicator'
</script>

## Usage

Indicators are the selection pictures shared by a checkbox, a radio, a selector, and a Markdown task list. They are decorative. The owning control keeps the input, the role, the accessible name, the focus, and the keyboard. The indicator only turns state into a picture. That split is what makes them themeable: restyle one through its class, or replace the component by name.

```vue
<script setup lang="ts">
import { RadioIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <RadioIndicator state="checked" />
</template>
```

The circle draws in both states. Unchecked is an empty circle, which is what lets it stand in for a check in a selection slot. There is no mixed state. Inside a radio that has no size, the circle stays 18px and the dot stays 8px. On its own, sm is 20px and md is 24px.

The box is [Checkbox Indicator](/en/components/checkbox-indicator). The mark you replace to get this circle everywhere is [Check Indicator](/en/components/check-indicator).

## Anatomy

| Element | Description |
| --- | --- |
| Chrome (checkbox, radio) | Required. The persistent circle drawn in every state. The check indicator has no chrome of its own. |
| State mark | The filled inner dot, shown only when the circle is chosen. |

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Restyle the stable class first. Replacing the component is the heavier path, for when the shape itself is wrong. |
| <Badge variant="success">Do</Badge> | Decide whether slot content replaces the mark with isRenderable, not a null check. An empty slot, including a condition that is false, keeps the circle and its dot. |
| <Badge variant="success">Do</Badge> | A replacement must set aria-hidden. The owning control provides the role and the accessible name. A visible indicator would be announced twice. |
| <Badge variant="success">Do</Badge> | Use theme tokens for every color, radius, and border width in a replacement. |
| <Badge variant="success">Do</Badge> | Render a single root element, and let it keep the border radius the focus ring should follow. The radio paints that ring onto the circle when the real input is focused. Do not draw a second ring. |
| <Badge variant="error">Don't</Badge> | Pass hover or pressed state in as props. Hover reaches the circle through the ancestor class astryx-indicator-scope. |
| <Badge variant="error">Don't</Badge> | Assume the graphic is mounted only when it is selected. The host renders the empty circle too. That is what lets it replace a check, which draws nothing when unchosen. |

## Examples

<DemoExample
  :demo="radioIndicatorStates"
  description="Empty and filled circles at sm and md, including disabled. Unchecked stays an empty circle."
  locale="en"
  title="States"
/>

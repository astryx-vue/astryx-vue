---
layout: component-docs
title: Check Indicator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkIndicatorLoading, checkIndicatorReplace, checkIndicatorStates } from '../../../../components/demos/check-indicator'
</script>

## Usage

Indicators are the selection pictures shared by a checkbox, a radio, a selector, and a Markdown task list. They are decorative. The owning control keeps the input, the role, the accessible name, the focus, and the keyboard. The indicator only turns state into a picture. That split is what makes them themeable: restyle one through its class, or replace the component by name.

```vue
<script setup lang="ts">
import { CheckIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <CheckIndicator state="checked" />
</template>
```

This is the mark on a chosen option. Unchecked, and with nothing in the slot, it renders nothing, so a list shows no empty box beside every row. It has no chrome of its own. It is the glyph, so a class passed by the host lands on the same element as the icon.

Map this name to [Radio Indicator](/en/components/radio-indicator) when every single-selection mark should be a circle, including the empty circle on an unchosen row. The box is [Checkbox Indicator](/en/components/checkbox-indicator).

## Anatomy

| Element | Description |
| --- | --- |
| Chrome (checkbox, radio) | Required on the box and the circle, which draw in every state. The check indicator is the state mark itself and has no chrome of its own. |
| State mark | The checkmark shown when the option is chosen. Unchecked draws nothing unless the slot has something renderable. |

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Restyle the stable class first. Replacing the component is the heavier path, for when the shape itself is wrong. |
| <Badge variant="success">Do</Badge> | Decide whether slot content replaces the mark with isRenderable, not a null check. The helper is shallow: it excludes null, undefined, booleans, and the empty string. An element still counts when its descendants later render nothing. A host writes a spinner with v-if="busy". When that condition is false, a null check deletes the chosen check. |
| <Badge variant="success">Do</Badge> | A replacement must set aria-hidden. The owning control provides the role and the accessible name. A visible indicator would be announced twice. |
| <Badge variant="success">Do</Badge> | Use theme tokens for every color, radius, and border width in a replacement. |
| <Badge variant="success">Do</Badge> | Render a single root element, and let it keep the border radius the focus ring should follow. The control paints that ring onto the indicator when the real input is visually hidden. Do not draw a second ring. |
| <Badge variant="error">Don't</Badge> | Pass hover or pressed state in as props. Hover reaches the graphic through the ancestor class astryx-indicator-scope. |
| <Badge variant="error">Don't</Badge> | Assume the graphic is mounted only when it is selected. The host renders it in every state and passes state. That is what lets a replacement draw an empty circle on an unchosen row. |

## Examples

<DemoExample
  :demo="checkIndicatorStates"
  description="Unchecked reserves no box. Checked draws the glyph at both sizes. Disabled uses the disabled icon color."
  locale="en"
  title="States"
/>

<DemoExample
  :demo="checkIndicatorReplace"
  description="The same row of marks. The left card is the default check. Inside the theme on the right, that name draws a circle, including the empty circle when nothing is chosen."
  locale="en"
  title="Replace by name"
/>

<DemoExample
  :demo="checkIndicatorLoading"
  description="A spinner in the slot holds the check's place whether or not the row is chosen. Turning it off removes that place when the row is unchosen."
  locale="en"
  title="Replace the mark while loading"
/>

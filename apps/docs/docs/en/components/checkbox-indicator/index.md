---
layout: component-docs
title: Checkbox Indicator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxIndicatorLoading, checkboxIndicatorSizes, checkboxIndicatorStates } from '../../../../components/demos/checkbox-indicator'
</script>

## Usage

Indicators are the selection pictures shared by a checkbox, a radio, a selector, and a Markdown task list. They are decorative. The owning control keeps the input, the role, the accessible name, the focus, and the keyboard. The indicator only turns state into a picture. That split is what makes them themeable: restyle one through its class, or replace the component by name.

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <CheckboxIndicator state="indeterminate" size="sm" />
</template>
```

The box draws in every state. Unchecked is an empty box, not an empty gap. A mixed state draws a short bar.

For a control the user can operate, use [CheckboxInput](/en/components/checkbox-input). The check and the circle are [Check Indicator](/en/components/check-indicator) and [Radio Indicator](/en/components/radio-indicator).

## Anatomy

| Element | Description |
| --- | --- |
| Chrome (checkbox, radio) | Required. The persistent box or circle drawn by the checkbox and radio indicators in every state. The check indicator is the state mark itself and has no chrome of its own. |
| State mark | The checkmark, the indeterminate bar, or the radio dot shown inside the chrome for the current state. |

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Restyle the stable class first. Replacing the component is the heavier path, for when the shape itself is wrong. |
| <Badge variant="success">Do</Badge> | Decide whether slot content replaces the mark with isRenderable, not a null check. The helper is shallow: it excludes null, undefined, booleans, and the empty string. An element still counts when its descendants later render nothing. A host writes a spinner with v-if="busy". When that condition is false, a null check deletes the state mark. |
| <Badge variant="success">Do</Badge> | A replacement must set aria-hidden. The owning control provides the role and the accessible name. A visible indicator would be announced twice. |
| <Badge variant="success">Do</Badge> | Use theme tokens for every color, radius, and border width in a replacement. |
| <Badge variant="success">Do</Badge> | Render a single root element, and let it keep the border radius the focus ring should follow. The control paints that ring onto the indicator when the real input is visually hidden. The ring is never missing. It is only the wrong shape if the root has no radius of its own. Do not draw a second ring. |
| <Badge variant="error">Don't</Badge> | Pass hover or pressed state in as props. Hover reaches the graphic through the ancestor class astryx-indicator-scope, so hovering the row tints the control with no props involved. |
| <Badge variant="error">Don't</Badge> | Assume the graphic is mounted only when it is selected. The host renders it in every state and passes state. That is what lets a replacement draw where the default draws nothing, such as an empty circle on an unchosen row. Drawing nothing in a state is the indicator's decision. |

## Examples

<DemoExample
  :demo="checkboxIndicatorSizes"
  description="The box at sm and md, including unchecked, checked, mixed, and disabled."
  locale="en"
  title="States"
/>

<DemoExample
  :demo="checkboxIndicatorStates"
  description="The buttons cycle the box, the check, and the circle. The check and the circle share the single-selection state."
  locale="en"
  title="Cycle the state"
/>

<DemoExample
  :demo="checkboxIndicatorLoading"
  description="A spinner in the default slot replaces the mark. Turning it off restores the box's check, and an unchosen check stops reserving space."
  locale="en"
  title="Replace the mark while loading"
/>

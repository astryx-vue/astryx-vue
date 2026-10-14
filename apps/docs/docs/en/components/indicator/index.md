---
layout: component-docs
title: Indicator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { indicatorLoading, indicatorReplace, indicatorStates } from '../../../../components/demos/indicator'
</script>

## Usage

The check, the box, and the circle only draw a selection state. The control that can be clicked and focused keeps the input, the role, the accessible name, and the keyboard. Checkbox, radio, selector, and a Markdown task list all take their mark from the same set. Replace one name, and every place that draws it follows.

The three graphics do different jobs. A check appears only when the row is chosen, so an unchosen row keeps no empty box. A box is always there, and a mixed state draws a short bar. A circle draws both states. Unchosen is an empty circle, which is why it can stand in for a check.

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
import { CheckIndicator, RadioIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <CheckIndicator state="checked" />
  <CheckboxIndicator state="indeterminate" size="sm" />
  <RadioIndicator state="unchecked" />
</template>
```

The box stays on its original path. The check and the circle come from the indicator entry.

Import the theme in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

To change a graphic everywhere, replace it by name on the theme. After the check is mapped to the circle, a selector's selection mark becomes a circle, and an unchosen row draws the empty circle too. Call sites do not each grow a slot.

```vue
<script setup lang="ts">
import { RadioIndicator } from '@astryx-vue/core/Indicator'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'
</script>

<template>
  <Theme :theme="defineTheme({ name: 'radio-marks', indicators: { check: RadioIndicator } })">
    <slot />
  </Theme>
</template>
```

The three core names are check, checkbox, and radio. Read the current graphic with useIndicator. A core name always resolves. A name you add resolves only when the nearest theme supplies a component.

Hover is not a prop. Put the scope class on the real control, and the box and the circle darken with it. The graphic has no hover prop of its own.

A loading spinner goes in the default slot. When that slot has nothing renderable, the original mark stays. A condition that is false does not delete a chosen check.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Put a shared replacement on the theme's indicator map, so the selector, the checkbox, and task lists change together. |
| <Badge variant="success">Do</Badge> | Put a loading spinner in the default slot, and show it only while the row is busy. |
| <Badge variant="success">Do</Badge> | Paint a custom graphic with the theme's color, radius, and border variables. |
| <Badge variant="error">Don't</Badge> | Pass a different slot at every call site. One of them will be missed. |
| <Badge variant="error">Don't</Badge> | Give the graphic a role, a tab stop, or a keyboard handler. Those belong to the control outside it. |
| <Badge variant="error">Don't</Badge> | Decide whether to draw the mark with a null check. A false condition deletes the chosen check. |

## Examples

<DemoExample
  :demo="indicatorStates"
  description="The buttons cycle the box through three states and the single-selection marks through two. The check and the circle share the second state."
  locale="en"
  title="States"
/>

<DemoExample
  :demo="indicatorReplace"
  description="The same row of marks. The left card is the default check. Inside the theme on the right, that name draws a circle, including the empty circle on the unchosen mark."
  locale="en"
  title="Replace by name"
/>

<DemoExample
  :demo="indicatorLoading"
  description="The spinner sits in the default slot. Turning it off restores the box's check, and the unchosen check stops reserving space."
  locale="en"
  title="Replace the mark while loading"
/>

## Accessibility

- The root of each graphic is hidden from assistive technology.
- The component sets no interactive role and provides no click or keyboard behavior.
- A passed role, tab order, content editable flag, or attribute whose name starts with aria is dropped. Those stay on the owning control.
- The exposed element is present when the check is drawn or a slot occupies its place. It is empty when the mark is unchosen and the slot is empty.

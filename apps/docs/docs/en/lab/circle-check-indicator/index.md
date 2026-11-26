---
title: CircleCheckIndicator
---

# CircleCheckIndicator

The iOS multiple-selection mark: an empty circle, a filled circle with a checkmark, or a filled circle with a bar for the partial state. It is a checkbox-family indicator: map it to `checkbox` with `defineTheme({ indicators })` and every `CheckboxInput` and `CheckboxList` draws it. It is decorative (`aria-hidden`); the owning control keeps the input, role, accessible name, focus, and keyboard behavior. Its colors fade over the theme duration on every pointer and change at once under Reduce Motion. A mouse or pen press paints on the circle at once and fades on release. It is a Lab component and ships only under the `canary` tag.

<script setup lang="ts">
import { labCircleCheckIndicator } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCircleCheckIndicator" description="A theme maps checkbox to CircleCheckIndicator, so these CheckboxInputs draw the iOS circle." locale="en" title="Map it in a theme" /></ClientOnly>

## Import

```ts
import { CircleCheckIndicator } from '@astryx-vue/lab'

const theme = defineTheme({
  name: 'circle-checks',
  indicators: { checkbox: CircleCheckIndicator },
})
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `'unchecked' \| 'checked' \| 'indeterminate'` | Required | Which state to draw. The unchecked circle is an empty ring, not nothing. |
| `size` | `'sm' \| 'md'` | `'md'` | Control size. The circle draws at UIKit's diameters, 18px (`sm`) or 21.8px (`md`), centered in the host's 20px or 24px slot. |
| `isDisabled` | `boolean` | `false` | Draws the disabled look. Purely visual; the owning control keeps the disabled semantics. |

## Slots

| Name | Description |
| --- | --- |
| default | Content drawn inside the circle instead of the mark, such as the loading spinner `CheckboxInput` passes while a change is pending. |

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Map it with `defineTheme({ indicators: { checkbox: CircleCheckIndicator } })` so `CheckboxInput` and `CheckboxList` keep their semantics and focus ring. |
| <Badge variant="success">Recommended</Badge> | Map it only in a theme meant for iOS. It draws the circle on every platform, and Android marks multiple choice with a square box. |
| <Badge variant="success">Recommended</Badge> | Keep a visible label beside it; the circle is decorative and announces nothing. |
| <Badge variant="error">Avoid</Badge> | Using it for a single choice; a radio, or a checkmark on the chosen row, says "one of these". |
| <Badge variant="error">Avoid</Badge> | Giving it a role, a label, or a tab stop; the owning control has those. |

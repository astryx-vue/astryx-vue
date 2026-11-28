---
title: SelectableCardGroup
---

# SelectableCardGroup

A set of `SelectableCard`s that speaks like the choice it makes. One choice is a radio group: the cards are native radios that share a name, the group is one tab stop, the arrow keys move between cards, and a screen reader says "2 of 3". Several choices are a named group of checkboxes. A card in a single-choice group only selects; choosing the chosen card again changes nothing. It is a Lab component and ships only under the `canary` tag.

<script setup lang="ts">
import { labSelectableCardGroup } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSelectableCardGroup" description="One plan out of three, as a radio group of cards." locale="en" title="Single choice" /></ClientOnly>

## Import

```ts
import { SelectableCardGroup, SelectableCardGroupItem } from '@astryx-vue/lab'
```

## SelectableCardGroup props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | Required | Visible label and accessible name of the group. |
| `modelValue` | `string \| null \| string[]` | Required | The chosen card's value, or `null` while none is chosen. With `selectionMode="multiple"`, the array of chosen values. Bind with `v-model`. |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | `single` is a radio group; `multiple` is a group of checkboxes. |
| `description` | `string` | `undefined` | Helper text under the label, linked to the group. |
| `isLabelHidden` | `boolean` | `false` | Hides the label visually; it still names the group. |
| `htmlName` | `string` | Generated | The name the group's value is submitted under with a form. |
| `isDisabled` | `boolean` | `false` | Disables every card. They stay focusable and announce as disabled. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | `horizontal` wraps the cards in rows; `vertical` stacks them. |

`class` and `style` land on the field box. Other attributes, including `aria-labelledby` and `aria-describedby` (added beside the label and description), land on the group element.

## SelectableCardGroupItem props

It takes every `SelectableCard` prop except `isSelected`, whose state comes from the group.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | The value this card stands for in the group's `modelValue`. |
| `label` | `string` | Required | Accessible name of the card. |
| `isDisabled` | `boolean` | `false` | Disables this card. |

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` / `change` | `string` or `string[]` | The new chosen value. In `multiple` mode, the new array, newest last. |

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use it when the cards are one choice out of a few, such as plans or shipping methods. |
| <Badge variant="success">Recommended</Badge> | Give every card a `label`; it names the native radio or checkbox. |
| <Badge variant="error">Avoid</Badge> | Putting a lone `SelectableCard` in a group-less list to mean one choice; its checkbox would let the user clear the choice. |

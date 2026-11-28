---
layout: component-docs
title: Selectable Card
outline: false
footer: false
---

<script setup lang="ts">
import { selectableCardColors, selectableCardElevated } from '../../../../components/demos/selectable-card'
</script>

## Usage

`SelectableCard` is a card with a selected state. The keyboard stop is a visually hidden checkbox. Bind the state with `v-model:is-selected`, or pass `:is-selected` and handle `update:isSelected` when several cards share one value.

The selected card draws an accent border and an inset ring. `elevation` stays in the shadow, and the ring is composed on top of it. `variant` recolors that accent.

```vue
<script setup lang="ts">
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { ref } from 'vue'

const selected = ref(new Set(['pro']))

function toggle(id: string, isSelected: boolean) {
  const next = new Set(selected.value)
  if (isSelected)
    next.add(id)
  else
    next.delete(id)
  selected.value = next
}
</script>

<template>
  <SelectableCard
    :is-selected="selected.has('pro')"
    label="Pro"
    @update:is-selected="(next) => toggle('pro', next)"
  >
    Pro
  </SelectableCard>
</template>
```

Use `SelectableCard` for multi-select choices, such as filter chips, feature add-ons, or option grids where several can be on, and track the selected IDs in a `Set`. Do not use it for a single-select group: each card is a checkbox, so assistive technology announces a multi-select group with one tab stop per card. For one choice among several, use `RadioList`, or `SelectableCardGroup` from `@astryx-vue/lab` when the choices should look like cards: it renders the cards as one radio group.


<ComponentAnatomy />

## Examples

<DemoExample :demo="selectableCardElevated" description="Starter and Pro sit on a low shadow. The selection ring layers on top." locale="en" title="Elevated" />
<DemoExample :demo="selectableCardColors" description="React, TypeScript, Node.js, Python, Rust, and Go. Each card keeps its own color, and more than one can be selected." locale="en" title="Multi-select" />

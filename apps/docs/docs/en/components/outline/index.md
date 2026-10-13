---
layout: component-docs
title: Outline
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { outlineControlled, outlineDeepNesting, outlineDensity, outlineOverview } from '../../../../components/demos/outline'
</script>

## Usage

`Outline` is a table of contents. Each item is `{ id, label, level }`. `id` matches a heading element on the page. `level` is 1 through 6. Levels 1 and 2 share the first indent. Level 3, 4, and 5–6 step inward after that.

Leave `activeId` unset and the outline follows scroll. It uses `scrollContainer` when you pass one, otherwise the nearest scrollable ancestor, otherwise the viewport. The active item is the last heading whose top has passed the resting line. At the bottom of the scroll, the last item is active. `offset` shifts that line and the scroll landing by the same amount, on top of each heading’s own `scroll-margin-top`.

Pass `activeId` and scroll-spy stays off. `v-model:active-id` keeps the highlight in your own state. `navigateStart` fires when a click starts a scroll. `navigateEnd` fires once for that navigation, when the scroll settles, when the reader interrupts it, or after 1.2 seconds.

`hasScrollOnClick` is on by default. A click with a modifier key, or a click whose target id is missing, does not take over the browser’s own behavior. Activating an item writes the hash with `history.pushState`.

```vue
<script setup lang="ts">
import { Outline } from '@astryx-vue/core/Outline'

const items = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'theming', label: 'Theming', level: 2 },
  { id: 'tokens', label: 'Tokens', level: 3 },
]
</script>

<template>
  <Outline :items="items" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Point each `id` at a real heading, and keep `level` equal to that heading’s level. |
| <Badge variant="success">Do</Badge> | Set `offset` to the height of a sticky header so the active item and the scroll landing agree. |
| <Badge variant="success">Do</Badge> | Use `density="compact"` in a narrow sidebar, and `default` beside a long article. |
| <Badge variant="error">Don't</Badge> | Pass `activeId` and also expect the built-in scroll-spy to keep updating it. A provided id turns the spy off. |
| <Badge variant="error">Don't</Badge> | Indent by hand with extra markup. The level already chooses the indent. |

## Examples

<DemoExample
  :demo="outlineOverview"
  description="A document outline with the active section highlighted by the sliding indicator track."
  locale="en"
  title="Outline"
/>

<DemoExample
  :demo="outlineControlled"
  description="Drive the active section yourself with activeId. Providing activeId disables the built-in scroll-spy so your own logic owns the highlight."
  locale="en"
  title="Outline — Controlled"
/>

<DemoExample
  :demo="outlineDeepNesting"
  description="Heading levels 1 through 4 map to progressively deeper indentation, so a long document with sub-sections stays scannable."
  locale="en"
  title="Outline — Deep Nesting"
/>

<DemoExample
  :demo="outlineDensity"
  description="Two density variants control item padding. Use compact for dense sidebars and default for standard documentation layouts. The sliding indicator automatically matches each item height."
  locale="en"
  title="Outline — Density"
/>

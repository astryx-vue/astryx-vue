---
layout: component-docs
title: Outline
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { outlineControlled, outlineDeepNesting, outlineDensity } from '../../../../components/demos/outline'
</script>

## Usage

`Outline` is a table of contents. Each item is `{ id, label, level }`. `id` matches a heading element on the page. `level` is 1 through 6. Levels 1 and 2 share the first indent. Level 3, 4, and 5–6 step inward after that.

Leave `activeId` unset and the outline follows scroll. It uses `scrollContainer` when you pass one, otherwise the nearest scrollable ancestor, otherwise the viewport. The active item is the last heading whose top has passed the resting line. At the bottom of the scroll, the last item is active. `offset` shifts that line and the scroll landing by the same amount, on top of each heading’s own `scroll-margin-top`.

Pass `activeId` and scroll-spy stays off. `v-model:active-id` keeps the highlight in your own state. `navigateStart` fires when a click starts a scroll. `navigateEnd` fires once for that navigation, when the scroll settles, when the reader interrupts it, or after 1.2 seconds.

`hasScrollOnClick` is on by default. A click with a modifier key, or a click whose target id is missing, does not take over the browser’s own behavior. Activating an item writes the hash with `history.pushState`.

`parseOutlineFromMarkdown` builds the outline from Markdown. The ids match the anchors `Markdown` renders on its headings. A hash inside a fence is not a heading. A heading inside a quote or a list consumes a duplicate id and stays out of the outline. `useOutlineFromMarkdown` recomputes when the source changes. `useOutlineFromDOM` reads h1–h6 that already have an id inside a container.

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


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Point each `id` at a real heading, and keep `level` equal to that heading’s level. |
| <Badge variant="success">Do</Badge> | Set `offset` to the height of a sticky header so the active item and the scroll landing agree. |
| <Badge variant="success">Do</Badge> | Use `density="compact"` in a narrow sidebar, and `default` beside a long article. |
| <Badge variant="error">Don't</Badge> | Pass `activeId` and also expect the built-in scroll-spy to keep updating it. A provided id turns the spy off. |
| <Badge variant="error">Don't</Badge> | Indent by hand with extra markup. The level already chooses the indent. |

## Examples

<DemoExample :demo="outlineControlled" description="activeId turns off the built-in scroll spy, so the highlight follows your own logic." locale="en" title="Controlled" />

<DemoExample :demo="outlineDeepNesting" description="Levels 1 through 4 step the indent inward, so a long document with subsections stays scannable." locale="en" title="Deep nesting" />

<DemoExample :demo="outlineDensity" description="Compact tightens the item padding for a dense sidebar. Default is the usual documentation rhythm. The indicator matches each item’s height." locale="en" title="Density" />

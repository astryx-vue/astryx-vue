---
layout: component-docs
title: Collapsible
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { collapsibleBasic, collapsibleChevronPosition, collapsibleControlled, collapsibleDisabled } from '../../../../components/demos/collapsible'
</script>

## Usage

`Collapsible` folds one content region behind a trigger: the trigger stays visible and a click expands or collapses the content underneath. It belongs in settings panels, FAQ pages, and detail views — places where the page should stay easy to scan while still letting people drill into what they care about. Several collapsibles side by side form a plain accordion, each managing its own state.

The shortest form gives a label and the content:

```vue
<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
</script>

<template>
  <Collapsible trigger="Shipping address">
    <p>Orders leave the warehouse within one business day, and the tracking number is emailed as soon as the parcel is scanned.</p>
  </Collapsible>
</template>
```

A collapsible starts expanded. Pass `:default-is-open="false"` when the content should stay hidden until someone asks for it. In that mode the component owns the state: clicking the trigger flips the content and reports the new state through the `openChange` event.

When something outside the component decides, lift the state with `v-model:is-open`. The component then renders exactly what the bound value says, and a click is only a request to change it:

```vue
<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Collapsible v-model:is-open="isOpen" trigger="Release notes">
    <p>Version 4.2 adds inline comments to shared reports.</p>
  </Collapsible>
</template>
```

The trigger is normally a plain text label passed to the `trigger` prop. When the label needs a heading, an icon, or extra controls, use the `trigger` slot instead; it replaces the prop completely. Expanding and collapsing play a real transition: the content region's height, padding, and opacity change together, and under `prefers-reduced-motion: reduce` the change lands immediately without the movement.

The trigger and the content are linked with `aria-expanded` and `aria-controls`, so a screen reader can move from the button straight to the region it controls. While collapsed the region stays the same element — `aria-controls` always points at it — but it is set to `display: none`, which keeps it out of the tab order and out of the accessibility tree.

`chevronPosition` decides which side of the label carries the disclosure chevron. The default `end` follows the label and points down while collapsed, up while expanded. Set it to `start` to lead the label with an arrow that points into the content while collapsed — mirrored in right-to-left layouts — and turns down when expanded, matching the rows of a file tree.

`isDisabled` dims the trigger, stops it responding to clicks, marks it `aria-disabled`, and takes it out of the tab order. It never collapses content that is already open; it only stops further changes.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Name what the section holds. The label is the button's accessible name, so a vague "More" or "Details" leaves screen reader users guessing. |
| <Badge variant="success">Do</Badge> | Collapse content that is long or only occasionally needed. A single short paragraph is better shown directly than hidden behind a click. |
| <Badge variant="success">Do</Badge> | Lift the state with `v-model:isOpen` when something outside the component decides, so the parent stays the single source of truth. |
| <Badge variant="success">Do</Badge> | Use `chevronPosition="start"` for nested rows and lists, where the arrow leaning into the content matches the file-tree convention, and keep the default `end` for standalone sections. |
| <Badge variant="success">Do</Badge> | Keep the trigger to its label. Put actions inside the content region or on their own row so a click is never ambiguous. |
| <Badge variant="error">Don't</Badge> | Hide critical or required content behind a collapsible. Many people will never open it, and the information is lost. |
| <Badge variant="error">Don't</Badge> | Nest collapsibles more than two levels deep; the content becomes hard to find and navigate. |
| <Badge variant="error">Don't</Badge> | Put the outcome of an action or an error inside a collapsible. Show that kind of message directly, or use a banner. |

## Examples

<DemoExample
  :demo="collapsibleBasic"
  description="Two independent sections: the first starts expanded to show the content region, the second stays collapsed."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="collapsibleControlled"
  description="The state lives in the parent: the button outside opens and closes the section, and clicking the trigger updates the bound value too."
  locale="en"
  title="Controlled state"
/>

<DemoExample
  :demo="collapsibleChevronPosition"
  description="The chevron follows the label by default; setting start leads with an arrow that points into the content while collapsed."
  locale="en"
  title="Chevron position"
/>

<DemoExample
  :demo="collapsibleDisabled"
  description="A disabled trigger is dimmed, leaves the tab order, and cannot be toggled, while content that was already open stays visible."
  locale="en"
  title="Disabled"
/>

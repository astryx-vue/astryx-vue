---
layout: component-docs
title: Typeahead Item
outline: false
footer: false
---

<script setup lang="ts">
import { typeaheadItemBasic } from '../../../../components/demos/typeahead-item'
</script>

## Usage

Default dropdown item renderer for typeahead results. Shows label with optional icon, description, and avatar. Exported for use in custom `renderItem` implementations.

```ts
import { TypeaheadItem } from '@astryx-vue/core/Typeahead'
```

The default row of a [Typeahead](/en/components/typeahead) dropdown is already this component, so most pages never name it. Import it when the row has to show something the plain result does not, such as a role or a team: put it in the `item` slot of `Typeahead` (the port's `renderItem`) and pass the extra text as `description`. The wrapper that holds highlight, selection, and keyboard behavior stays the same, so the custom row still answers to the arrow keys and Enter.

`item.description` is drawn when no `description` prop is given, so a source that already carries one needs no prop at all.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="typeaheadItemBasic" title="Basic" description="A typeahead whose results are rendered with TypeaheadItem, adding a secondary description below each label. Use inside renderItem to keep custom results visually consistent." locale="en" />

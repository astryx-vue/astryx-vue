---
layout: component-docs
title: useCombobox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useComboboxAssignTo } from '../../../../components/demos/use-combobox'
</script>

## Usage

Holds the interaction logic of a combobox: the open state, a highlighted option, search filtering, and keyboard navigation. It renders nothing, so you bring the input and the list. Disabled options are skipped when the highlight moves, and the list opens on the current value.

```ts
import { useCombobox } from '@astryx-vue/core'
```

Pass the options and the current value as refs, then bind `onKeyDown` to the input and render `filteredOptions`. Use `activeIndex` for `aria-activedescendant`, and call `select(value)` when an option is chosen. Selecting closes the list and clears the search.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give the input `role="combobox"`, `aria-expanded`, and `aria-activedescendant`, and give the list `role="listbox"` with `role="option"` rows. |
| <Badge variant="success">Do</Badge> | Select on `mousedown` with `preventDefault`, so the input keeps focus and its blur handler does not close the list first. |
| <Badge variant="error">Don't</Badge> | Rebuild the keyboard handling by hand. `onKeyDown` already covers arrows, Home, End, Enter, Escape, and type-to-jump. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useComboboxAssignTo"
  description="An assign-to field built on useCombobox: typing filters the people, the arrow keys skip the disabled name, and Enter assigns the highlighted person."
  locale="en"
  title="useCombobox — Assign-to Field"
/>

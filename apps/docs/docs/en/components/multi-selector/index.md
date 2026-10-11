---
layout: component-docs
title: Multi Selector
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { multiSelectorBadges, multiSelectorBasic, multiSelectorStates } from '../../../../components/demos/multi-selector'
</script>

## Usage

`MultiSelector` picks several values from a fixed list. Without a search field, the trigger is a combobox. The menu is a listbox with `aria-multiselectable`. Choosing an option leaves the menu open.

An option can be a string, an object with a description, a divider, or a labeled section. `selectAll` adds a row that toggles every enabled option and skips disabled ones. `searchable` filters that same list. It does not call a remote source.

`triggerDisplay` controls the closed trigger. `count` shows how many are selected, `labels` joins the text, and `badges` uses tokens. `maxBadges` limits how many are visible, and the rest collapse to `+N`. A narrower trigger collapses further.

Arrow keys move the highlight. `Enter` and Space toggle the highlighted option. Space inside the search field still types. `Escape` closes the menu. When the menu is closed and the user is not searching, `Backspace` clears the selection.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use Multi Selector when the list is short and people need to compare the choices. |
| <Badge variant="success">Do</Badge> | Use `badges` and `+N` when the closed trigger should still name the selection. |
| <Badge variant="error">Don't</Badge> | Search a remote source with Multi Selector. Use Tokenizer for that. |

## Examples

<DemoExample
  :demo="multiSelectorBasic"
  description="Searchable, clearable, and select all. The disabled option inside the section stays unselected."
  locale="en"
  title="Multiple selection"
/>

<DemoExample
  :demo="multiSelectorBadges"
  description="The trigger shows at most two tokens. The rest collapse to +N."
  locale="en"
  title="Tag overflow"
/>

<DemoExample
  :demo="multiSelectorStates"
  description="A disabled field with a reason stays focusable. The error state prints its message under the field."
  locale="en"
  title="Disabled and error"
/>

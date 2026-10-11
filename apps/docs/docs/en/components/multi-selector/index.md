---
layout: component-docs
title: Multi Selector
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { multiSelectorColumns, multiSelectorForm, multiSelectorGhost, multiSelectorSearchable, multiSelectorSections, multiSelectorSheet } from '../../../../components/demos/multi-selector'
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
  :demo="multiSelectorSheet"
  description="Keeps a multi-selection list open in a bottom sheet while choices are toggled."
  locale="en"
  title="Bottom Sheet"
/>

<DemoExample
  :demo="multiSelectorColumns"
  description="Column visibility toggle with hidden label, search, select-all, and selection count."
  locale="en"
  title="Column Visibility"
/>

<DemoExample
  :demo="multiSelectorForm"
  description="Two multi-selectors in a form with required and optional states."
  locale="en"
  title="Form Composition"
/>

<DemoExample
  :demo="multiSelectorGhost"
  description="Borderless variant composed with ghost buttons in a toolbar."
  locale="en"
  title="Ghost Toolbar"
/>

<DemoExample
  :demo="multiSelectorSearchable"
  description="Multi-select with search filtering and select-all."
  locale="en"
  title="Searchable"
/>

<DemoExample
  :demo="multiSelectorSections"
  description="Multi-select with options grouped into labeled sections."
  locale="en"
  title="Sectioned Permissions"
/>

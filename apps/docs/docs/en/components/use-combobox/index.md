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

## A field you render yourself

For a single-line text field you render, spread the prop getters instead of wiring the attributes by hand. Focus never leaves the field: the active option is named through `aria-activedescendant`, and the field keeps every key the list does not need.

```vue
<script setup lang="ts">
import { useCombobox } from '@astryx-vue/core'
import { computed, ref } from 'vue'

const query = ref('')
const picked = ref<string | null>(null)
const options = computed(() => people.filter(person => person.label.toLowerCase().includes(query.value.toLowerCase())))
const combobox = useCombobox({ options, modelValue: picked, onChange: value => (picked.value = value as string | null), listboxId: 'people' })
</script>

<template>
  <input v-model="query" aria-label="Assign to" v-bind="combobox.getFieldProps()" @input="combobox.open()">
  <ul v-if="combobox.isOpen.value && options.length > 0" aria-label="People" v-bind="combobox.getListboxProps()">
    <li v-for="(option, index) in options" :key="option.value" v-bind="combobox.getOptionProps(index)">
      {{ option.label }}
    </li>
  </ul>
</template>
```

- `getFieldProps(handlers?)` returns `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` only while the listbox is shown (open, with at least one option), `aria-activedescendant` only while an option is active, and the key handler. Pass your own `onKeydown` here: it runs after the combobox's handler, unless that handler claimed the key.
- `getListboxProps()` returns `id`, `role="listbox"` and a press handler that keeps focus in the field. Render the list while it is open and there are options, and name it with `aria-label` or `aria-labelledby`. Render other controls, such as a create button or an empty message, beside the list.
- `getOptionProps(index)` returns `id`, `role="option"`, `aria-selected` (true on the active option), `aria-disabled` on a disabled one, a pointer move that makes it active without moving focus, and a press that picks it.
- `getItemId(index)` is the option's id. `listboxId` is the list's id, and it is generated when you leave it out.

While the list is shown, `ArrowDown` and `ArrowUp` move the active option and wrap; `Enter` picks an active option and only then stops the field's own `Enter`; `Escape`, whatever modifier is held, hides the list without closing an enclosing dialog or popover on the same press. While it is hidden, `ArrowDown` shows it when there are options. `Home`, `End`, other chords such as `Shift+Enter`, and every other key reach the field. No key moves, picks or hides while an input method is composing text. When a new query changes the options, set `activeIndex` yourself: `0` so `Enter` picks the first option, or `-1` so `Enter` stays the field's. Announce the number of results with `useAnnounce`.

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

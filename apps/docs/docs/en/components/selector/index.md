---
layout: component-docs
title: Selector
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

The `Selector` is a dropdown component that expands to show a list of options when clicked. Users can select one item and the list collapses. It supports search filtering, clearing selection, and disabling specific options.

Basic usage requires an options array and a bound value:

```vue
<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const selected = ref(null)
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Selector v-model="selected" :options="options" placeholder="Select a fruit" />
</template>
```

Each option object contains a `value` (unique identifier) and `label` (display text). Optional `disabled` property can disable specific options, and `description` can add auxiliary text.

Enable `searchable` to show a search box that filters options as users type. Enable `clearable` to show a clear button next to the selected value.

```vue
<template>
  <Selector
    v-model="selected"
    :options="options"
    searchable
    clearable
    placeholder="Search or select"
  />
</template>
```

Full keyboard navigation is supported: arrow keys move the highlight up and down, `Home` and `End` jump to the first and last options, `Enter` selects the current item, and `Escape` closes the list.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Enable search when options exceed 10 items to help users find items quickly. |
| <Badge variant="success">Do</Badge> | Provide a clear button for non-required fields so users can deselect. |
| <Badge variant="success">Do</Badge> | Use concise, clear option labels and avoid overly long text. |
| <Badge variant="error">Don't</Badge> | Put more than 100 options in a selector; consider pagination or async loading. |
| <Badge variant="error">Don't</Badge> | Use selector for multi-select; use a dedicated multi-select component instead. |

## Examples

Selector component examples will display normally in the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | `null` | Selected value |
| `options` | `SelectorOption[]` | Required | Options array |
| `placeholder` | `string` | `'Please select'` | Placeholder text |
| `searchable` | `boolean` | `false` | Whether to support search |
| `clearable` | `boolean` | `false` | Whether clearable |
| `disabled` | `boolean` | `false` | Whether disabled |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | Status |

## Emits

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number \| null` | Emitted when value changes |
| `change` | `value: string \| number \| null` | Emitted when value changes |
| `search` | `query: string` | Emitted when search input changes |

## Slots

| Name | Parameters | Description |
| --- | --- | --- |
| `selected` | `{ option: SelectorOption \| null }` | Customize selected item display |
| `option` | `{ option: SelectorOption, isActive: boolean, isSelected: boolean }` | Customize option display |
| `empty` | - | Customize empty state |

## Keyboard Interaction

| Key | Function |
| --- | --- |
| `Enter` / `Space` | Open/close selector |
| `ArrowDown` | Highlight next option |
| `ArrowUp` | Highlight previous option |
| `Home` | Highlight first option |
| `End` | Highlight last option |
| `Enter` | Select current highlighted item |
| `Escape` | Close selector |

## Accessibility

- Uses `role="combobox"` and `role="listbox"` semantics
- Supports `aria-expanded` state
- Supports `aria-activedescendant` navigation mode
- Full keyboard navigation support

---
layout: component-docs
title: Typeahead
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { typeaheadAsync, typeaheadStates, typeaheadStatic } from '../../../../components/demos/typeahead'
</script>

## Usage

`Typeahead` is a single-select search field. The input is a combobox and the menu is a listbox. Use `createStaticSource` for local data, or implement `search` for a remote source.

Local search matches the label and optional keywords. Set `debounceMs` to `0` to filter immediately:

```vue
<script setup lang="ts">
import { createStaticSource, Typeahead } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

const selected = ref(null)
const source = createStaticSource([
  { id: 'apple', label: 'Apple' },
  { id: 'grape', label: 'Grape' },
], { keywords: item => item.id === 'grape' ? ['raisin'] : [] })
</script>

<template>
  <Typeahead v-model="selected" :search-source="source" label="Fruit" :debounce-ms="0" show-on-focus />
</template>
```

An async source returns a Promise. `useAsyncSource` waits until typing pauses, 150 milliseconds by default, then starts the request. A newer search cancels the previous one, and a stale response is dropped. An empty query uses `bootstrap` when it exists. Loading, no results, and a failed request each get their own row in the menu.

Arrow keys move the highlight, `Enter` selects it, and `Escape` closes the menu. While focus is in the input, `Home` and `End` move the caret. After a selection, the value collapses to a focusable token. Focusing it again returns to search.

Built-in strings are English. Call `provideAstryxLocale('zh-CN')` for the Chinese strings.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `debounceMs` to 0 for local data, and keep the default delay for remote requests. |
| <Badge variant="success">Do</Badge> | Abort the request when `signal` is cancelled so an older response cannot replace a newer one. |
| <Badge variant="error">Don't</Badge> | Use typeahead for multiple values. Use Multi Selector for a fixed list, and Tokenizer for searchable tags. |

## Examples

<DemoExample
  :demo="typeaheadStatic"
  description="A local list filters by label and keywords. Grape also matches “raisin”."
  locale="en"
  title="Static search"
/>

<DemoExample
  :demo="typeaheadAsync"
  description="The request waits 400 milliseconds. Typing “error” shows the error state. Loading and empty states appear in the menu too."
  locale="en"
  title="Async search"
/>

<DemoExample
  :demo="typeaheadStates"
  description="A disabled field with a reason stays focusable. The error state prints its message under the field."
  locale="en"
  title="Disabled and error"
/>

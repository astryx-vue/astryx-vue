---
layout: component-docs
title: Tokenizer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenizerBasic, tokenizerOverflow, tokenizerStates } from '../../../../components/demos/tokenizer'
</script>

## Usage

`Tokenizer` collects search results into removable tokens. The source matches Typeahead: `createStaticSource` for local data, or a `search` function for a remote source. Selected items stay out of the menu.

`creatable` turns the current text into a new token. `clearable` removes every token. When the input is empty, `Backspace` removes the last token. Arrow keys move focus between tokens, and `Backspace` or `Delete` removes the focused one.

`overflow` controls what happens when the tokens do not fit:

| Value | Behavior |
| --- | --- |
| `none` | Tokens wrap and stay visible. |
| `unfocused-inline` | On blur, they collapse to one line ending in `+N`, then expand in place on focus. |
| `unfocused-layer` | On blur they also collapse to one line. On focus they expand over the field and do not push the content below. |

Width measurement uses `useOverflow`. The `#icon` slot sits at the start of the field. `#token` can replace each selected chip with a custom `Token`.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `unfocused-inline` when there may be many tags and the field should stay on one line. |
| <Badge variant="success">Do</Badge> | Turn on `creatable` when people can mint a value, and tell `add` from `create` in the change event. |
| <Badge variant="error">Don't</Badge> | Use Tokenizer for a short fixed list. Use Multi Selector for that. |

## Examples

<DemoExample
  :demo="tokenizerBasic"
  description="Search, create, and clear. The @ mark comes from the icon slot."
  locale="en"
  title="Search and select many"
/>

<DemoExample
  :demo="tokenizerOverflow"
  description="On blur the tags collapse to one line with +N. Focusing the field expands them."
  locale="en"
  title="Tag overflow"
/>

<DemoExample
  :demo="tokenizerStates"
  description="A disabled field with a reason stays focusable. The error state prints its message under the field."
  locale="en"
  title="Disabled and error"
/>

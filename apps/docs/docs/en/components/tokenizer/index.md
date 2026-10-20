---
layout: component-docs
title: Tokenizer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenizerClear, tokenizerCreatable, tokenizerEnd, tokenizerIcon, tokenizerMax, tokenizerOverflow, tokenizerStates } from '../../../../components/demos/tokenizer'
</script>

## Usage

`Tokenizer` collects search results into removable tokens. The source matches Typeahead: `createStaticSource` for local data, or a `search` function for a remote source. Selected items stay out of the menu.

`hasCreate` turns the current text into a new token. `hasClear` removes every token. When the input is empty, `Backspace` removes the last token. Arrow keys move focus between tokens, and `Backspace` or `Delete` removes the focused one.

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
| <Badge variant="success">Do</Badge> | Turn on `hasCreate` when people can mint a value, and tell `add` from `create` in the change event. |
| <Badge variant="error">Don't</Badge> | Use Tokenizer for a short fixed list. Use Multi Selector for that. |


<ComponentAnatomy />

## Examples

<DemoExample
  :demo="tokenizerClear"
  description="Tokenizer with a built-in clear-all button for bulk removal."
  locale="en"
  title="Clear"
/>

<DemoExample
  :demo="tokenizerCreatable"
  description="Free-text tokenizer for creating custom tags, and a combined create-or-search pattern."
  locale="en"
  title="Creatable"
/>

<DemoExample
  :demo="tokenizerEnd"
  description="Tokenizer with an action button in the end slot."
  locale="en"
  title="End Content"
/>

<DemoExample
  :demo="tokenizerIcon"
  description="Tokenizer with a leading search icon."
  locale="en"
  title="Icon"
/>

<DemoExample
  :demo="tokenizerMax"
  description="Tokenizer with a maximum selection limit. The input stops accepting more once the limit is reached."
  locale="en"
  title="Max Entries"
/>

<DemoExample
  :demo="tokenizerOverflow"
  description="On blur, tokens collapse to one line. Inline mode pushes content down on expand; layer mode overlays without shifting layout."
  locale="en"
  title="Overflow"
/>

<DemoExample
  :demo="tokenizerStates"
  description="Disabled, error, warning, and success states."
  locale="en"
  title="States"
/>

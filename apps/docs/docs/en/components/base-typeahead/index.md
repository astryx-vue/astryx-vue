---
layout: component-docs
title: Base Typeahead
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { baseTypeaheadCustomResults } from '../../../../components/demos/base-typeahead'
</script>

## Usage

Composable combobox engine providing a bare input, search, keyboard navigation, and a styled result dropdown. It renders no input wrapper, border, or selected-value token. `Typeahead` and `Tokenizer` compose it for standard fields.

```ts
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
```

The port keeps the same division of work. `BaseTypeahead` owns the input, the search source, the keyboard model, and the dropdown. The caller owns the field label, the description, the status message, and the selected-value token, and puts them around the engine. `label` here is only the input's accessible name, so omit it when an outside `<label for>` already names the input.

<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `Typeahead` or `Tokenizer` for standard fields; they wrap `BaseTypeahead` with input chrome and selected-value rendering it intentionally omits. |
| <Badge variant="success">Do</Badge> | Provide your own visible label or `aria-label` and custom input wrapper so the bare combobox has an accessible name, focus treatment, border, and layout. |
| <Badge variant="success">Do</Badge> | Pass `anchorRef` pointing to your wrapper so the dropdown positions against your custom input chrome, not just the bare input element. |
| <Badge variant="error">Avoid</Badge> | Expect input chrome or selected-value rendering. `BaseTypeahead` is an engine; the caller owns those visible parts. |
| <Badge variant="error">Avoid</Badge> | Use `BaseTypeahead` when `Typeahead` or `Tokenizer` would suffice; the extra wrapper and styling work is only justified for truly custom compositions. |
| <Badge variant="error">Avoid</Badge> | Treat Escape as cancellation of pending source work. It hides the current popup, but a late response can reopen it. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="baseTypeaheadCustomResults" title="BaseTypeahead" description="A custom result renderer that adds supporting metadata while BaseTypeahead retains option semantics and keyboard behavior." locale="en" />

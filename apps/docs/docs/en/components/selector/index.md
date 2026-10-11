---
layout: component-docs
title: Selector
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { selectorBasic, selectorSearchable, selectorClearable, selectorSizes } from '../../../../components/demos/selector'
</script>

## Usage

`Selector` is a dropdown component that expands to show a list of options when clicked. Users can select one item and the list collapses. It supports search filtering, clearing selection, and disabling specific options.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Enable search when options exceed 10 items to help users find items quickly. |
| <Badge variant="success">Do</Badge> | Provide a clear button for non-required fields so users can deselect. |
| <Badge variant="success">Do</Badge> | Use concise, clear option labels and avoid overly long text. |
| <Badge variant="error">Don't</Badge> | Put more than 100 options in a selector; consider pagination or async loading. |
| <Badge variant="error">Don't</Badge> | Use selector for multi-select; use a dedicated multi-select component instead. |

## Examples

<DemoExample
  :demo="selectorBasic"
  description="Pass options array and bind value, click to expand list and select an item."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="selectorSearchable"
  description="Enable searchable to show a search box for filtering options."
  locale="en"
  title="Searchable"
/>

<DemoExample
  :demo="selectorClearable"
  description="Enable clearable to show a clear button next to selected value."
  locale="en"
  title="Clearable"
/>

<DemoExample
  :demo="selectorSizes"
  description="Available in sm, md, lg sizes, md by default."
  locale="en"
  title="Sizes"
/>

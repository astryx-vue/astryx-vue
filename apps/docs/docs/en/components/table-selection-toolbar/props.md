---
layout: component-docs
title: Table Selection Toolbar
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TableSelectionToolbar props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>How many rows are selected. It is printed as the count label at the start of the bar. Required.</td></tr>
</tbody></table>
</div>

## Events

- `clear()`: fires when the clear command is clicked. Empty the selected keys and the count label follows.

## Slots

- `default`: product actions. They sit between the count label and the clear command.

## Native attributes

The root element is a `<div>` with `role="region"`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

The bar reads three built-in strings: the region name, the count label, and the clear label. They default to `Bulk actions`, `{count} selected`, and `Unselect All`, and switch to Chinese after `provideAstryxLocale('zh-CN')`. The React API exposes `selection`, `label`, `renderSelectionLabel`, `clearLabel`, `size`, `variant`, `startContent`, and `xstyle`. In Vue, pass the count as `count`, put actions in the default slot, and style the bar with `class` or `style`; the copy comes from the locale messages instead of props.

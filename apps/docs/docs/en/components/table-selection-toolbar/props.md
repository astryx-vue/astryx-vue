---
layout: component-docs
title: Table Selection Toolbar
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TableSelectionToolbar props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td><code>0</code></td><td>How many rows are selected. Used when <code>selection</code> is not given.</td></tr>
<tr><td><code>selection</code></td><td><code>TableSelectionState</code></td><td>—</td><td>The <code>selectionState</code> returned by <code>useTableSelectionState</code>. Takes over from <code>count</code> and drives the clear command.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>Built-in copy</td><td>Accessible name for the action surface. Defaults to <code>Bulk actions</code>.</td></tr>
<tr><td><code>clearLabel</code></td><td><code>string</code></td><td>Built-in copy</td><td>Visible label of the command that clears the whole selection. Defaults to <code>Unselect All</code>.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'sm'</code></td><td>Height of the bar. The clear command follows it.</td></tr>
<tr><td><code>variant</code></td><td><code>SectionVariant</code></td><td><code>'muted'</code></td><td>Surface of the bar: <code>section</code> uses the surface colour, <code>muted</code> the muted background, <code>transparent</code> none.</td></tr>
</tbody></table>
</div>

## Events

- `clear()`: fires when the clear command is clicked. With `selection` passed, the bar empties the selected keys itself before emitting.

## Slots

<div class="component-api-table" role="region" aria-label="TableSelectionToolbar slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Slot props</th><th>Description</th></tr></thead><tbody>
<tr><td><code>start</code></td><td>—</td><td>Product actions, aligned to the logical start. Child controls do not inherit <code>size</code>, so set it on them.</td></tr>
<tr><td><code>default</code></td><td>—</td><td>Same place as <code>start</code>. Kept for older code; <code>start</code> wins when both are given.</td></tr>
<tr><td><code>label</code></td><td><code>{ count: number }</code></td><td>Replaces the visible count text for localisation or domain-specific copy.</td></tr>
</tbody></table>
</div>

## Native attributes

The root element is a `<div>` with `role="toolbar"` and `aria-orientation="horizontal"`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

Three strings come from the locale messages: the accessible name (`Bulk actions`), the count text (`{count} selected`), and the clear label (`Unselect All`). They switch to Chinese after `provideAstryxLocale('zh-CN')`, and `label`, `clearLabel`, and the `label` slot replace them one by one.

When `selection` is passed and nothing is selected, the bar renders nothing at all. The `count` form always renders, so a bar mounted for a fixed count keeps its place.

Two React-only props are not in the Vue API: `xstyle` becomes `class` or `style`, and the whole toolbar is placed by the surrounding layout. `renderSelectionLabel` and `startContent` become the `label` and `start` slots.

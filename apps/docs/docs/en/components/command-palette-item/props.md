---
layout: component-docs
title: Command Palette Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="CommandPaletteItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Identity of the row. Keep it unique in the list: highlight, active-descendant, and selection all resolve through it. Required.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Blocks selection and drops the row out of the keyboard order. Sets <code>aria-disabled</code>.</td></tr>
<tr><td><code>isHighlighted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether this row is the active keyboard result. When omitted, the row reads the state of the surrounding <code>CommandPalette</code>. Pass it explicitly for a standalone preview.</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether this row holds the selected value in picker mode. When omitted, the row compares <code>value</code> with the palette's <code>v-model:value</code>. Sets <code>aria-selected</code>.</td></tr>
</tbody></table>
</div>

## Events

- `select(value: string)`: the row was activated by pointer, Enter, or Space. Inside a `CommandPalette` the palette then writes the value and closes.

## Slots

- `default`: the row content. Keep it non-interactive; put icons, text, and shortcut hints here, not buttons or links.

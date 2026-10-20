---
layout: component-docs
title: Table Cell
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TableCell props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>'start' | 'center' | 'end'</code></td><td>—</td><td>Alignment of the cell text. Left untouched, the cell uses the table's default alignment.</td></tr>
<tr><td><code>colSpan</code></td><td><code>number</code></td><td>—</td><td>How many columns the cell covers.</td></tr>
<tr><td><code>rowSpan</code></td><td><code>number</code></td><td>—</td><td>How many rows the cell covers.</td></tr>
<tr><td><code>headers</code></td><td><code>string</code></td><td>—</td><td>Ids of the header cells that describe this cell, so a screen reader can read the cell with its headers.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the cell content.

## Native attributes

The root element is `<td>`. Every other attribute and event lands on it, so `class`, `style`, and `id` behave as they do on a plain table cell.

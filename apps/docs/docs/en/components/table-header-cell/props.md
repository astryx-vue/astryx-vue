---
layout: component-docs
title: Table Header Cell
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TableHeaderCell props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>'start' | 'center' | 'end'</code></td><td>—</td><td>Alignment of the header text. Left untouched, the cell uses the table's default alignment.</td></tr>
<tr><td><code>colSpan</code></td><td><code>number</code></td><td>—</td><td>How many columns the header cell covers.</td></tr>
<tr><td><code>rowSpan</code></td><td><code>number</code></td><td>—</td><td>How many rows the header cell covers.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the header cell content.

## Attributes

The rest of the attributes land on the `<th>`, so `class`, `style`, and `id` work as they do on a plain header cell. The rendered element always carries `scope="col"`, which is what lets a screen reader tie each column's cells to this header.

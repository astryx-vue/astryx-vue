---
layout: component-docs
title: Grid Span
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="GridSpan props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>columns</code></td><td><code>number | 'full'</code></td><td>—</td><td>Number of columns to span, rendered as <code>grid-column: span N</code>. <code>'full'</code> renders <code>grid-column: 1 / -1</code>, which spans the row whatever the column count is.</td></tr>
<tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>Number of rows to span, rendered as <code>grid-row: span N</code>.</td></tr>
</tbody></table>
</div>

Leave both out and the item keeps a single cell.

## Slots

- `default`: the content of the spanning item.

## Template ref

`GridSpan` exposes `element`.
Its type is `HTMLDivElement | null`.

## Native attributes

The root element receives HTML attributes, `aria-*` attributes, `data-*` attributes, `class`, and `style`. `class` is merged with the component's own classes. When <code>style</code> and <code>columns</code> or <code>rows</code> both set the same property, the props win.

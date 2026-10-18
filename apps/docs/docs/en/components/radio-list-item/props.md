---
layout: component-docs
title: Radio List Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="RadioListItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>RadioValue</code> (<code>string | number</code>)</td><td>—</td><td>The value this row reports when it becomes the selected one. Required.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Primary text for the row, and the radio's accessible name. Required.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Secondary text below the label, read after the name.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables this row. It keeps its place in the group and stays unselected.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Read-only. The selection can be read and submitted but not changed, and the row does not dim.</td></tr>
</tbody></table>
</div>

## Slots

- `end`: content after the label and description, aligned to the trailing edge.

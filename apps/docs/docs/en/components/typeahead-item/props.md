---
layout: component-docs
title: Typeahead Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TypeaheadItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>item</code></td><td><code>SearchableItem</code></td><td>—</td><td>The search result this row shows. Required; the label comes from its <code>label</code>.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Text under the label. Wins over the item's own <code>description</code>.</td></tr>
<tr><td><code>group</code></td><td><code>string</code></td><td>—</td><td>Accepted so the prop name matches upstream. The row draws no heading; the dropdown groups rows itself from <code>item.auxiliaryData.group</code>.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Paints the row as unavailable. It stays in the list and the arrows skip it.</td></tr>
</tbody></table>
</div>

## Slots

- `icon`: icon or avatar shown before the label. The wrapper is hidden from assistive technology, so the artwork needs no label.

The row reads `item.disabled` on its own as well, so a disabled result looks disabled even without the prop.

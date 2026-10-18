---
layout: component-docs
title: Metadata List Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="MetadataListItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>The name of the field. Required. The default slot is the value.</td></tr>
</tbody></table>
</div>

## Slots

- default: the value. Any content works: a string, a badge, a link, or markup of your own.
- `icon`: a leading icon drawn before the label.

The pair renders as a `<dt>` and a `<dd>`, or as one stacked block when the list puts labels above values. Either way the label is announced before the value.

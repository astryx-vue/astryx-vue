---
layout: component-docs
title: Input Group Text
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="InputGroupText props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td><code>id</code> for the text element. Useful when you need to target the prefix or suffix from a test or from <code>aria-describedby</code>.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the text or icon to show. Rendered as-is inside the text element.

## Native attributes

The component renders a `<span>`. Attributes that are not props land on that span, so `class` and `style` style the prefix or suffix itself.

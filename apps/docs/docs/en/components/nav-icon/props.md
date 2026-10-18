---
layout: component-docs
title: Nav Icon
outline: false
footer: false
---

## NavIcon Props

<div class="component-api-table" role="region" aria-label="NavIcon Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>CSS icon class drawn on the round badge, such as <code>i-carbon-search</code>. Without it the default slot is rendered.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Diameter of the badge.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name. With a label the badge is an image for assistive tech; without one it is hidden, which is right when the text beside it already says what it is.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the icon content, used when `iconClass` is not set. Put an `Icon` or any element of the same size here.

The badge is display-only: it is a `span`, never a button or a link, so do not hang a click handler on it. Reach for `IconButton` or `NavItem` when the thing has to be pressable.

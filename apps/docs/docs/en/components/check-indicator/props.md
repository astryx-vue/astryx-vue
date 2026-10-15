---
layout: component-docs
title: Check Indicator
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Check Indicator props" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>state</code></td><td><code>'unchecked' | 'checked'</code></td><td>—</td><td>Required. The default draws nothing when unchecked. A replacement may draw in both states.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Recorded on the element. The glyph itself is 1rem at both sizes, matching the small icon.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Visual only. The chosen glyph uses the disabled icon color. The owning row keeps the disabled semantics.</td></tr>
</tbody></table>
</div>

## Slots

- The default slot replaces the mark in every state, chosen or not. A host passes a pending spinner through it.
- When the slot has something renderable, a 1rem box holds the place.
- With nothing renderable, an unchosen check renders nothing. Use isRenderable. A false condition must not delete a chosen check.
- Slot content is decorative. Do not put a focusable control in it.

## Accessibility

- The root is `aria-hidden="true"` when the check is drawn or the slot occupies its place.
- The component sets no interactive role and provides no click or keyboard behavior.
- A passed role, tab order, content editable flag, or attribute whose name starts with aria is dropped.
- The exposed element is empty when the mark is unchosen and the slot is empty.

## Theme

There is no chrome class. A chosen check is the icon. A slot is `.astryx-check-indicator`, 1rem square.

- Checked uses the accent icon color. Disabled uses the disabled icon color.
- `data-size` is sm or md.
- `data-disabled` is set when the row is disabled.

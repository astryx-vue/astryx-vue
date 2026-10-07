---
layout: component-docs
title: Checkbox Indicator
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Properties" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>state</code></td><td><code>'unchecked' | 'checked' | 'indeterminate'</code></td><td>—</td><td>Required. The visual state.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Indicator size.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Shows disabled styling.</td></tr>
</tbody></table>
</div>

## Slots

- The default slot replaces the checkmark and dash.
- Slot content is decorative.
- Do not put focusable controls in the slot.

## Accessibility

- The root always has `aria-hidden="true"`.
- The component has no interactive role.
- It ignores `role`, `tabindex` and `contenteditable` attributes.
- It provides no click or keyboard behavior.
- The exposed `element` is `HTMLSpanElement | null`.

## Theme

The indicator shares color variables with [CheckboxInput](/en/components/checkbox-input/props#theme).

- `.astryx-checkbox-indicator`: outer box.
- `.astryx-checkbox-indicator-check`: checkmark.
- `.astryx-checkbox-indicator-dash`: indeterminate mark.
- `data-state`: current visual state.
- `data-size`: current size.
- `data-disabled`: disabled state.

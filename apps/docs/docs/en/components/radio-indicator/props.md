---
layout: component-docs
title: Radio Indicator
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Radio Indicator props" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>state</code></td><td><code>'unchecked' | 'checked'</code></td><td>—</td><td>Required. Single selection has no mixed state. Unchecked draws an empty circle.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>20px or 24px. The inner dot is 8px or 10px. Omit it inside a radio that has no size, and the circle stays 18px.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Visual only. The circle fades and an empty one uses the muted background. The owning control keeps the disabled semantics.</td></tr>
</tbody></table>
</div>

## Slots

- The default slot replaces the inner dot and is drawn inside the circle.
- An empty slot, including a condition that is false, keeps the circle and the dot.
- Slot content is decorative. Do not put a focusable control in it.

## Accessibility

- The root always has `aria-hidden="true"`.
- The component sets no interactive role and provides no click or keyboard behavior.
- A passed role, tab order, content editable flag, or attribute whose name starts with aria is dropped.
- The exposed element is the circle.

## Theme

- `.astryx-radio-indicator`: the circle.
- `.astryx-radio-indicator-dot`: the inner dot when chosen.
- `data-state`: unchecked or checked.
- `data-size`: sm or md. Omitted when no size is passed.
- `data-disabled`: disabled styling.

A chosen circle uses the input status color first, so a field error or warning still tints it, then the accent color. Hover comes from an ancestor `.astryx-indicator-scope`, and only for a pointer that can hover. Reduced motion turns the transition off. In forced colors, an empty circle uses the canvas color and a chosen circle uses the highlight.

The focus ring is painted by the radio on `.astryx-radio-native:focus-visible + .astryx-radio-indicator`. The circle's radius is what that outline follows.

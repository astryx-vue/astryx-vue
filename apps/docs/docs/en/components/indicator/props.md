---
layout: component-docs
title: Indicator
outline: false
footer: false
---

## Shared props

The check, the box, and the circle take the same props. The box adds a mixed state. The check and the circle are only unchosen or chosen.

<div class="component-api-table" role="region" aria-label="Indicator props" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>state</code></td><td>See the table below</td><td>—</td><td>Required. The state to draw.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>The box and the circle are 20px or 24px. The check glyph is 1rem at both sizes. The size is still written on the element.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Visual only. The owning control keeps the disabled semantics.</td></tr>
</tbody></table>
</div>

<div class="component-api-table" role="region" aria-label="Indicator states" tabindex="0">
<table><thead><tr><th>Graphic</th><th>States</th><th>When unchosen</th></tr></thead><tbody>
<tr><td>Check</td><td><code>'unchecked' | 'checked'</code></td><td>Renders nothing when the slot is empty, so a list keeps no gap.</td></tr>
<tr><td>Box</td><td><code>'unchecked' | 'checked' | 'indeterminate'</code></td><td>An empty box. Mixed draws a short bar.</td></tr>
<tr><td>Circle</td><td><code>'unchecked' | 'checked'</code></td><td>An empty circle. Inside a radio with no size, the circle is 18px and the dot is 8px.</td></tr>
</tbody></table>
</div>

## Slots

- The default slot replaces the state mark. The content is decorative.
- The box and the circle keep their own mark when the slot is empty, including when a condition is false.
- When the check slot has something renderable, a 1rem box holds the place in either state. With nothing renderable, an unchosen check renders nothing.
- Use isRenderable to decide. Null, a boolean, an empty string, a comment, and whitespace-only text do not count. An element does, even when its descendants later render nothing.
- Do not put a focusable control in the slot.

## Registry

<div class="component-api-table" role="region" aria-label="Indicator registry" tabindex="0">
<table><thead><tr><th>Name</th><th>From</th><th>Description</th></tr></thead><tbody>
<tr><td><code>useIndicator(name)</code></td><td><code>@astryx-vue/core/Indicator</code></td><td>The component for that name on the nearest theme. A core name always resolves. Also exported from the package root.</td></tr>
<tr><td><code>getIndicator(name, theme)</code></td><td>same</td><td>Resolve from a theme object outside a component. With no theme, the default graphic is used.</td></tr>
<tr><td><code>defaultIndicators</code></td><td>same</td><td>The default check, box, and circle components.</td></tr>
<tr><td><code>isCoreIndicatorName(name)</code></td><td>same</td><td>Whether the name is one of those three.</td></tr>
<tr><td><code>isRenderable(value)</code></td><td>same</td><td>Whether a slot or vnode should replace the mark.</td></tr>
<tr><td><code>defineTheme({ indicators })</code></td><td><code>@astryx-vue/core/Theme</code></td><td>Replace graphics by name. Shallow-merged with the theme this one extends. This theme wins.</td></tr>
</tbody></table>
</div>

A selector places the mark at the start or the end of an option with indicatorPosition. The default is the end. An empty mark column takes no width.

## Theme

The box uses the same variables as [Checkbox Indicator](/en/components/checkbox-indicator/props#theme). The circle uses the classes and states below.

- `.astryx-radio-indicator`: the circle.
- `.astryx-radio-indicator-dot`: the inner dot when chosen.
- `.astryx-check-indicator`: the 1rem box that holds the check's slot. With no slot, the chosen check is the icon itself.
- `data-state`: unchecked or checked. The box may also be indeterminate.
- `data-size`: sm or md. A radio with no size does not set it.
- `data-disabled`: disabled styling.

A chosen circle uses the input status color first, so a field error or warning still tints it, then the accent color. Hover comes from an ancestor `.astryx-indicator-scope`, and only for a pointer that can hover. Reduced motion turns the transition off. In forced colors, an empty circle uses the canvas color and a chosen circle uses the highlight.

A chosen check uses the accent icon color, and the disabled color when disabled. Both sizes use the small icon.

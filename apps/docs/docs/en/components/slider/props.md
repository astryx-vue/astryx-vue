---
layout: component-docs
title: Slider
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Properties" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>number | [number, number]</code></td><td>—</td><td>Required. A single value or a range.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. The slider name.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Association ID prefix. Generated when omitted.</td></tr>
<tr><td><code>min</code></td><td><code>number</code></td><td>0</td><td>Minimum value.</td></tr>
<tr><td><code>max</code></td><td><code>number</code></td><td>100</td><td>Maximum value.</td></tr>
<tr><td><code>step</code></td><td><code>number</code></td><td>1</td><td>Increment per step. Must be greater than 0.</td></tr>
<tr><td><code>minStepsBetweenThumbs</code></td><td><code>number</code></td><td>0</td><td>Minimum number of steps between range thumbs.</td></tr>
<tr><td><code>orientation</code></td><td><code>&#x27;horizontal&#x27; | &#x27;vertical&#x27;</code></td><td>horizontal</td><td>Slider orientation.</td></tr>
<tr><td><code>valueDisplay</code></td><td><code>&#x27;tooltip&#x27; | &#x27;text&#x27; | &#x27;none&#x27;</code></td><td>tooltip</td><td>How to display values.</td></tr>
<tr><td><code>formatValue</code></td><td><code>(value: number) =&gt; string</code></td><td>—</td><td>Formats display values and accessible value text.</td></tr>
<tr><td><code>marks</code></td><td><code>SliderMark[]</code></td><td>—</td><td>Marks. Each has a value and optional label.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description below the label.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Hides the visual label. Preserves its accessible name.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Prevents changes. Excludes form values.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Disabled reason. Keeps disabled thumbs focusable.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows the required marker. Does not run native required validation.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows the optional marker. Overrides isRequired.</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Required marker text.</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Optional marker text.</td></tr>
<tr><td><code>minLabel</code></td><td><code>string</code></td><td>Minimum value</td><td>Accessible name for the lower thumb.</td></tr>
<tr><td><code>maxLabel</code></td><td><code>string</code></td><td>Maximum value</td><td>Accessible name for the upper thumb.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Field width. Numbers use pixels.</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Name for hidden form values.</td></tr>
<tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>ID of the associated form.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning or success status.</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative label icon.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Information tooltip beside the label.</td></tr>
</tbody></table>
</div>

## Events

- `update:modelValue(value)`: updates a number or range.
- `change(value)`: fires when the value changes.
- `changeEnd(value)`: fires after a drag, pointer cancellation or keyboard adjustment.

Each supported key press fires `changeEnd`.
An unchanged value at a boundary does not fire `change`.
Disabling the component during a drag cancels that drag.
This cancellation does not fire `changeEnd`.

## Ranges and steps

- Use a `number` for single-value mode.
- Use `[number, number]` for range mode.
- Steps are relative to `min`.
- Minimum separation is `minStepsBetweenThumbs × step`.
- Thumbs cannot cross.
- Values outside the bounds display at the nearest bound.
- Input ranges display in ascending order.
- Display normalization does not update the bound model by itself.
- Non-positive steps use `1`.
- If `max` is below `min`, the interval collapses to `min`.

## Forms

- Set `htmlName` to submit one hidden field for a single value.
- Ranges submit two hidden fields with the same name.
- Read ranges with `FormData.getAll(name)`.
- Disabled sliders do not submit values.
- Native form reset does not change `v-model`.
- Update the bound value in the form's `reset` handler to reset it.

## Template references and attributes

- `element`: the control's `HTMLDivElement | null`.
- `focus(index = 0, options?)`: focuses the specified thumb.
- `blur()`: removes thumb focus.
- `class`, `style` and other attributes apply to the outer field.
- `aria-labelledby` and `aria-describedby` merge into each thumb.
- The component owns thumb roles, values, bounds and disabled states.
- The `labelIcon` slot replaces the label icon.

## Theme

```css
.my-slider {
  --astryx-slider-accent: #047857;
  --astryx-slider-focus: #047857;
  --astryx-slider-height: 200px;
}
```

- `--astryx-slider-track`: unfilled track color.
- `--astryx-slider-accent`: filled track and thumb color.
- `--astryx-slider-focus`: keyboard focus color.
- `--astryx-slider-height`: vertical control height.

Thumb diameter is fixed at `20px`. Track thickness is `4px`.
Neutral follows the active light or dark mode.

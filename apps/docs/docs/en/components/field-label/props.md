---
layout: component-docs
title: Field Label
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="FieldLabel props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Label text. Required.</td></tr>
<tr><td><code>inputId</code></td><td><code>string</code></td><td>—</td><td><code>id</code> of the control this label belongs to. Becomes the <code>for</code> attribute, and the base for the generated label and description ids. Required.</td></tr>
<tr><td><code>labelId</code></td><td><code>string</code></td><td><code>`${inputId}-label`</code></td><td><code>id</code> put on the label element itself. Point the control's <code>aria-labelledby</code> at it when the label is not a real <code>label</code>.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supporting line under the label. Clicking it focuses the control, unless the label is a group label or disabled.</td></tr>
<tr><td><code>descriptionId</code></td><td><code>string</code></td><td><code>`${inputId}-description`</code></td><td><code>id</code> put on the description. Reference it from the control's <code>aria-describedby</code>.</td></tr>
<tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders the label as a <code>span</code> with no <code>for</code>, for a group of controls instead of a single input.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the label visually. It stays in the accessibility tree.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Dims the label and stops the description from focusing the control.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the optional marker. Wins over <code>isRequired</code> when both are set.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the required marker. Inside a <code>FormLayout</code> with <code>defaultOptionality="required"</code> the marker is suppressed, because being required is the default.</td></tr>
<tr><td><code>labelIcon</code></td><td><code>IconName | Component</code></td><td>—</td><td>Icon rendered before the label text, inside a 16px box. The wrapper is <code>aria-hidden</code>, so the icon must not carry meaning on its own.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip text for the info button at the end of the label row.</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>Text of the optional marker. Override it to localize.</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>Text of the required marker. Override it to localize.</td></tr>
</tbody></table>
</div>

## Slots

- `labelIcon`: icon before the label text. Same place as the `labelIcon` prop, and the slot wins when both are passed.

## Exposed

- `element`: the rendered label element.

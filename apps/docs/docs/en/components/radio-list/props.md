---
layout: component-docs
title: Radio List
outline: false
footer: false
---

## RadioList Props

<div class="component-api-table" role="region" aria-label="RadioList props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | number</code></td><td>—</td><td>Required. The selected value.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name of the group.</td></tr>
<tr><td><code>options</code></td><td><code>RadioOption[]</code></td><td>—</td><td>Plain options. Use items when a row needs an end slot.</td></tr>
<tr><td><code>orientation</code></td><td><code>'vertical' | 'horizontal'</code></td><td><code>'vertical'</code></td><td>Stack the rows, or place them in a row.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Indicator size. 20px or 24px. A plain Radio stays 18px.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Help text under the group label.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>Where the status message sits.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the group.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Why the whole group is disabled. With <code>isDisabled</code>, the message shows in a tooltip on hover or keyboard focus and every option stays focusable with <code>aria-disabled</code>; selection stays blocked.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the group required.</td></tr>
<tr><td><code>containerClass</code></td><td><code>string</code></td><td>—</td><td>Class on the field shell. It has no effect inside a horizontal-labels form.</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style on the field shell.</td></tr>
<tr><td><code>controlClass</code></td><td><code>string</code></td><td>—</td><td>Class on the radio group (<code>role="radiogroup"</code>).</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style on the radio group.</td></tr>
</tbody></table>
</div>

## RadioListItem Props

<div class="component-api-table" role="region" aria-label="RadioListItem props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>Required value submitted when the row is selected.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required row label. Use the <code>label</code> slot for rich content such as a link; activating the link does not select the row.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Secondary text under the label. Rich content goes in the <code>description</code> slot.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables this row.</td></tr>
</tbody></table>
</div>

The `end` slot renders after the label, aligned to the trailing edge in a vertical list.

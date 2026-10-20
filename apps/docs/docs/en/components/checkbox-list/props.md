---
layout: component-docs
title: Checkbox List
outline: false
footer: false
---

## CheckboxList Props

<div class="component-api-table" role="region" aria-label="CheckboxList props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string[]</code></td><td>—</td><td>Checked values. Omit it for standalone rows.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name of the group.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Help text under the label.</td></tr>
<tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code></td><td>Row padding. Compact uses a small checkbox.</td></tr>
<tr><td><code>hasDividers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Draws a divider between rows.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>Where the status message sits.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables every row.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Why the whole group is disabled. With <code>isDisabled</code>, the message shows in a tooltip on hover or keyboard focus and every row stays focusable with <code>aria-disabled</code>. The older <code>disabledReason</code> name works too.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Read-only group. Checks stay and do not dim, but cannot change. Disabled wins when both are set.</td></tr>
<tr><td><code>changeAction</code></td><td><code>(values) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after a check changes. The row shows a spinner and cannot be toggled until it finishes.</td></tr>
</tbody></table>
</div>

## CheckboxListItem Props

<div class="component-api-table" role="region" aria-label="CheckboxListItem props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required row label. It names the checkbox.</td></tr>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Required in collection mode. Omit it for a standalone row.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Secondary text, also the checkbox description.</td></tr>
<tr><td><code>isChecked</code></td><td><code>boolean | 'indeterminate'</code></td><td>—</td><td>Standalone checked state. Ignored in collection mode.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables this row.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Loading for this row. The checkbox shows a spinner and cannot be toggled.</td></tr>
</tbody></table>
</div>

## CheckboxListItem events and slots

`check` emits the next boolean for a standalone row. The `end` slot renders after the label.

---
layout: component-docs
title: Checkbox List Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="CheckboxListItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Primary text for the row. It also names the checkbox, so no separate accessible name is needed. Required.</td></tr>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Row identity, matched against the parent <code>CheckboxList</code> array. Required in collection mode. Leave it out for a standalone row.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Secondary text below the label. It is also the checkbox description, read after the label.</td></tr>
<tr><td><code>isChecked</code></td><td><code>CheckboxValue</code> (<code>boolean | 'indeterminate'</code>)</td><td><code>false</code></td><td>Checked state of a standalone row. Ignored while the parent <code>CheckboxList</code> has a value array.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables this row. The row stays in place and stays readable; it cannot be toggled.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Loading for this row. The checkbox shows a spinner and the row cannot be toggled. In collection mode the parent list turns it on while the toggled value's <code>changeAction</code> is still running.</td></tr>
</tbody></table>
</div>

## Events

- `check(checked: boolean)`: fires with the next state of a standalone row. Ignored in collection mode, where the parent list reports the change through its own `change` event.

## Slots

- `end`: content after the label and description, such as a badge or a count.

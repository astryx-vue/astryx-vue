---
layout: component-docs
title: Radio
outline: false
footer: false
---

## Radio Props

<div class="component-api-table" role="region" aria-label="Radio props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>Required. Option value.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. Visible label and accessible name.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description shown below the label.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>ID of the native input. Auto-generated when omitted.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable this option.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Make this option read-only.</td></tr>
</tbody></table>
</div>

## Events

- `change(value, event)`: fired when the user selects this option.

When Radio is used inside RadioGroup, RadioGroup coordinates the change events.

## Slots

- `labelIcon`: decorative icon before the label.

## Usage constraint

`Radio` depends on `RadioContext`. When used standalone, it falls back to a context-free state and renders a single radio button only.
Always use Radio as a child of RadioGroup or RadioList.

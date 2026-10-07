---
layout: component-docs
title: Radio Group
outline: false
footer: false
---

## RadioGroup Props

<div class="component-api-table" role="region" aria-label="RadioGroup props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | number</code></td><td>—</td><td>Required. Currently selected value.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. Accessible name of the group.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>ID of the group container. Auto-generated when omitted.</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Shared name for the radios. Auto-generated when omitted.</td></tr>
<tr><td><code>options</code></td><td><code>RadioOption[]</code></td><td>—</td><td>Array of options. Alternative to the default slot.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Component width. Numbers are treated as px.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description shown below the label.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the visual label while keeping the accessible name.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the entire group.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Make the entire group read-only.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show required indicator and enable native required validation.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show optional indicator. Takes precedence over isRequired.</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>Text for the optional indicator.</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>Text for the required indicator.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status type, message, and message ID.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>Where to display the status message.</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative icon before the label.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip shown next to the label.</td></tr>
</tbody></table>
</div>

## Status

`status` has these fields:

- `type`: `'error'`, `'warning'`, or `'success'`.
- `message`: message text.
- `messageId`: message ID.

The default `statusVariant` is `detached`, so the message appears below the group.

## Events

- `update:modelValue(value)`: emitted after the selected value changes.
- `change(value, event)`: fired after the model updates.

`event` is a cancellable `RadioChangeEvent`.
`event.detail.originalEvent` keeps the native event.

## Slots

- `default`: Radio children. Alternative to `options`.
- `labelIcon`: decorative icon before the label. Overrides the `labelIcon` prop.

## Template ref

- `element`: `HTMLDivElement | null`.

## Native attributes

`class` and `style` are applied to the outer wrapper.
Unrecognized native attributes and listeners are forwarded to the group container.

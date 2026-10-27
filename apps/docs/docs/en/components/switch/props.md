---
layout: component-docs
title: Switch
outline: false
footer: false
---

## Switch Props

<div class="component-api-table" role="region" aria-label="Switch props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>boolean</code></td><td>—</td><td>Required. Current switch state.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. Accessible name of the control.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>ID of the native input. Auto-generated when omitted.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Switch size.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Component width. Numbers are treated as px.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description shown below the label.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the visual label while keeping the accessible name.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevent changes.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Reason for disabling. The control stays focusable when this is provided.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevent changes. The value is still submitted.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show loading state and block repeated toggles.</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Current locale</td><td>Text announced while the switch is busy. Defaults to the active locale: Loading in English, 加载中 in Chinese.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show required indicator and enable native required validation.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show optional indicator. Takes precedence over isRequired.</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>Text for the optional indicator.</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>Text for the required indicator.</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Form field name. Takes precedence over native name.</td></tr>
<tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>ID of the associated form.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status type, message, and message ID.</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>Where to display the status message.</td></tr>
<tr><td><code>changeAction</code></td><td><code>SwitchChangeAction</code></td><td>—</td><td>Action run after toggling. Supports Promise.</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the input after mount.</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative icon before the label.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip shown next to the label.</td></tr>
</tbody></table>
</div>

## Status

`status` has these fields:

- `type`: `'error'`, `'warning'`, or `'success'`.
- `message`: message text.
- `messageId`: message ID.

The default `statusVariant` is `detached`, so the message appears below the switch.

## Events

- `update:modelValue(value)`: emitted after the user toggles.
- `change(value, event)`: fired after the model updates.
- `actionError(error, value, event)`: emitted when the async action rejects or throws.

`event` is a cancellable `SwitchChangeEvent`.
`event.detail.originalEvent` keeps the native event.
Calling `event.preventDefault()` inside `change` skips `changeAction`.
It does not roll back the model update.

## Async action

`changeAction(value, event)` receives the new value and the component event.

- The component shows a loading state while the Promise is pending.
- Repeated toggles are blocked until the Promise settles.
- The parent-bound value takes precedence over any temporary display value.
- The component clears the loading state after success or failure.
- Failed actions do not roll back the value written to `v-model`.
- Use `@action-error` to display failures.
- Roll back in application code when needed.

## Slots

- `labelIcon`: decorative icon before the label. Overrides the `labelIcon` prop.

## Template ref

- `element`: `HTMLInputElement | null`.
- `focus(options?: FocusOptions)`: focus the input.
- `blur()`: remove focus from the input.

## Native attributes

`class` and `style` are applied to the outer wrapper.
Unrecognized native attributes and listeners are forwarded to the `input`.
The component manages `checked`, `type`, `role`, and core ARIA states.

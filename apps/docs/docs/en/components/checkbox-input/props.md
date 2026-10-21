---
layout: component-docs
title: Checkbox Input
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Properties" tabindex="0">
<table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>boolean | 'indeterminate'</code></td><td>—</td><td>Required. The current selection.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required accessible name. The label carries both <code>astryx-field-label</code> and <code>astryx-checkbox-label</code>, so a theme can style the checkbox label apart from a field label.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Native input ID. Generated when omitted.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>sm is 20px. md is 24px.</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Component width. Numbers use pixels.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description below the label.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label. Preserves its accessible name.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Prevents changes. Excludes the field from form submission.</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Disabled reason. Keeps the disabled control focusable.</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>Prevents changes. Checked fields still submit.</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>Shows loading. Blocks repeat activation.</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>Accessible loading text.</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows the required marker. Enables native required validation.</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows the optional marker. Takes precedence over isRequired.</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>Optional marker text.</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>Required marker text.</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Form field name. Overrides native name.</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status type, message and message ID.</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative icon before the label.</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip for the information button beside the label.</td></tr>
<tr><td><code>changeAction</code></td><td><code>CheckboxInputChangeAction</code></td><td>—</td><td>Action after a selection change. Supports a Promise.</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>Focuses the input after mounting.</td></tr>
</tbody></table>
</div>

## Status messages

`status` contains these fields:

- `type`: `'error'`, `'warning'` or `'success'`.
- `message`: optional message text.
- `messageId`: optional message ID.

Messages appear below the checkbox. Errors use assertive announcements. Warnings and successes use polite announcements.

## Events

- `update:modelValue(value)`: emits a boolean after activation.
- `change(value, event)`: fires after the model update.
- `actionError(error, value, event)`: fires when an action rejects or throws.

`event` is a cancelable `CheckboxInputChangeEvent`.
`event.detail.originalEvent` contains the native event.
Call `event.preventDefault()` in `change` to skip `changeAction`.
This does not undo the model update.

## Async actions

`changeAction(value, event)` receives the new value and component event.

- Returning a Promise shows the loading state.
- Pending actions block repeat activation.
- Explicit parent updates override the temporary selection.
- Loading clears after success or failure.
- Failures do not revert values written to `v-model`.
- Use `@action-error` to show failure information.
- Update the bound value in application code if you need a rollback.

## Native forms

- `htmlName` or `name` sets the field name.
- Native `value` sets the submitted value. The default is `'on'`.
- `value` does not control selection. Use `v-model` for selection.
- Unchecked and indeterminate fields do not submit.
- Checked read-only fields submit.
- Disabled fields do not submit.
- Fields with a disabled reason use `aria-disabled` and have no native form owner.
- `isOptional` overrides `isRequired`. An explicit native `required` attribute still applies.

After `form.reset()`, the component restores the current `v-model`.
To clear the selection, update the bound value in the form's `reset` handler.

## Template references and attributes

- `element`: `HTMLInputElement | null`.
- `focus(options?: FocusOptions)`: focuses the input.
- `blur()`: removes input focus.
- `class` and `style` apply to the outer component.
- Undeclared native attributes and events pass to `input`.
- `aria-labelledby` and `aria-describedby` merge with internal IDs.
- The component owns `checked`, `indeterminate`, `type` and core ARIA states.

## Slots

- `labelIcon`: a decorative icon before the label. Overrides the `labelIcon` prop.

## Theme

```css
.my-checkbox {
  --astryx-checkbox-accent: #047857;
  --astryx-checkbox-on-accent: #fff;
  --astryx-checkbox-focus: #047857;
}
```

- `--astryx-checkbox-background`: unchecked background.
- `--astryx-checkbox-border`: unchecked border.
- `--astryx-checkbox-accent`: checked and indeterminate background.
- `--astryx-checkbox-on-accent`: selection mark color.
- `--astryx-checkbox-focus`: keyboard focus color.
- `--astryx-checkbox-disabled-background`: disabled unchecked background.
- `--astryx-radius-inner`: indicator corner radius.

Neutral follows `color-scheme`.
Set `data-astryx-color-mode="light"` or `"dark"` to choose a mode.

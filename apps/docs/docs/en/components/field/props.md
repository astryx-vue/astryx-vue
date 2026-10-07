---
layout: component-docs
title: Field
outline: false
footer: false
---

## Field Props

<div class="component-api-table" role="region" aria-label="Field Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Visible label. Still names the control when visually hidden.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label and description without removing accessible associations.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text between the label and control.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Disabled state. Field/FieldLabel only style the label. Consumers disable their custom control.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows an optional indicator and takes precedence over isRequired.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows a required indicator; TextInput also sets aria-required.</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Vue icon component before the label. The labelIcon slot takes precedence.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info button beside the label, available on hover, keyboard focus and click.</td></tr>
      <tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Localized optional indicator.</td></tr>
      <tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Localized required indicator.</td></tr>
      <tr><td><code>inputId</code></td><td><code>string</code></td><td>Required</td><td>ID of the labeled control. Must match the control id.</td></tr>
      <tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>Label element ID, also used with aria-labelledby for groups.</td></tr>
      <tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>Description ID, referenced by aria-describedby.</td></tr>
      <tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>Uses a span to label groups such as radiogroup instead of a single-control label.</td></tr>
      <tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status type, optional message and custom messageId.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27; | &#x27;tooltip&#x27;</code></td><td>attached</td><td>Tooltip hides the inline message but retains its description and announcement. The control supplies its own tooltip button.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>Whole-field width. Numbers become pixels.</td></tr>
    </tbody>
  </table>
</div>

## FieldLabel Props

<div class="component-api-table" role="region" aria-label="FieldLabel Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Visible label. Still names the control when visually hidden.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label and description without removing accessible associations.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text between the label and control.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Disabled state. Field/FieldLabel only style the label. Consumers disable their custom control.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows an optional indicator and takes precedence over isRequired.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows a required indicator; TextInput also sets aria-required.</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Vue icon component before the label. The labelIcon slot takes precedence.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info button beside the label, available on hover, keyboard focus and click.</td></tr>
      <tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Localized optional indicator.</td></tr>
      <tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Localized required indicator.</td></tr>
      <tr><td><code>inputId</code></td><td><code>string</code></td><td>Required</td><td>ID of the labeled control. Must match the control id.</td></tr>
      <tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>Label element ID, also used with aria-labelledby for groups.</td></tr>
      <tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>Description ID, referenced by aria-describedby.</td></tr>
      <tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>Uses a span to label groups such as radiogroup instead of a single-control label.</td></tr>
    </tbody>
  </table>
</div>

## FieldStatus Props

<div class="component-api-table" role="region" aria-label="FieldStatus Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>type</code></td><td><code>&#x27;error&#x27; | &#x27;warning&#x27; | &#x27;success&#x27;</code></td><td>Required</td><td>Status meaning and color.</td></tr>
      <tr><td><code>message</code></td><td><code>string</code></td><td>Required</td><td>Status text. An empty string hides the message box.</td></tr>
      <tr><td><code>variant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27;</code></td><td>attached</td><td>Attached overlaps a bordered control. Detached suits sliders, switches and similar controls.</td></tr>
      <tr><td><code>isVisuallyHidden</code></td><td><code>boolean</code></td><td>false</td><td>Keeps only the accessible description and announcement when the control supplies its own tooltip.</td></tr>
    </tbody>
  </table>
</div>

## Slots

Field requires a default slot receiving the following properties:

```ts
interface FieldSlotProps {
  inputId: string
  labelId: string
  descriptionId?: string
  statusId?: string
  describedBy?: string
}
```

- `Field` and `FieldLabel` provide a `labelIcon` slot.
- The `labelIcon` slot overrides the matching prop.
- The icon is decorative.
- `FieldStatus` has no slots. Pass its text through `message`.

## Status messages

```ts
interface FieldStatusInput {
  type: 'error' | 'warning' | 'success'
  message?: string
  messageId?: string
}
```

### Announcements

- `error` uses an `aria-live="assertive"` region.
- `warning` uses an `aria-live="polite"` region.
- `success` uses an `aria-live="polite"` region.
- When the message changes, the component announces it again.
- An empty message clears the announcement region.
- The visual message does not duplicate `aria-live`.

### Message layout

- `attached`: joins the message to the control. Place it beneath a bordered control inside `Field`.
- `detached`: separates the message from the control. The message includes a status icon.
- `Field` in `tooltip` mode: hidden text remains available for descriptions and announcements. The inner control supplies the tooltip button.

For a standalone `FieldStatus`, use `detached`.

## Events

These three components declare no custom events.

## Template refs

Each component exposes `element`:

| Component | Element |
| --- | --- |
| `Field` | The field's root `div`. |
| `FieldLabel` | The label element or group `span`. |
| `FieldStatus` | The visual message element. |

Before mounting, `element` is `null`.
Without a message, `FieldStatus.element` is `null`.

## Native attributes

| Component | Attribute target |
| --- | --- |
| `Field` | The field root. |
| `FieldLabel` | The label group. |
| `FieldStatus` | The message element. |

Pass these directly to the inner control:

- `name`.
- `required`.
- `disabled`.
- Control event listeners.

## Imports

```ts
import type { FieldProps, FieldSlotProps, FieldStatusInput } from '@astryx-vue/core/Field'
import { Field, FieldLabel, FieldStatus } from '@astryx-vue/core/Field'
import '@astryx-vue/themes/neutral.css'
```

## Theme

- `--astryx-spacing-1`: spacing between field contents.
- `--astryx-spacing-2`: padding for detached status messages.
- `--astryx-radius-element`: status message corner radius.
- `--astryx-color-text-secondary`: supporting text color.
- `--astryx-text-label-size`: label font size.
- `--astryx-text-supporting-size`: description and status message font size.

Status colors use the `TextInput` variables. See [TextInput validation states](/en/components/text-input/props#validation-states) for the complete list.

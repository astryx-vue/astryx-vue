---
layout: component-docs
title: Text Input
outline: false
footer: false
---

## TextInput Props

<div class="component-api-table" role="region" aria-label="TextInput Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>string</code></td><td>Required</td><td>Input value, normally bound with v-model.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Visible label. Still names the control when visually hidden.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label and description without removing accessible associations.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text between the label and control.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Disables the input. Disabled values are excluded from form submission.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows an optional indicator and takes precedence over isRequired.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows a required indicator; TextInput also sets aria-required.</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Vue icon component before the label. The labelIcon slot takes precedence.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info button beside the label, available on hover, keyboard focus and click.</td></tr>
      <tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Localized optional indicator.</td></tr>
      <tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Localized required indicator.</td></tr>
      <tr><td><code>id</code></td><td><code>string</code></td><td>Generated</td><td>Native input ID. Label and description associations update together.</td></tr>
      <tr><td><code>type</code></td><td><code>&#x27;text&#x27; | &#x27;password&#x27; | &#x27;email&#x27;</code></td><td>text</td><td>Single-line input type. Use a textarea for multiline content.</td></tr>
      <tr><td><code>size</code></td><td><code>&#x27;sm&#x27; | &#x27;md&#x27; | &#x27;lg&#x27;</code></td><td>md</td><td>Neutral heights are 28, 32 and 36px respectively.</td></tr>
      <tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>Prevents editing, but remains focusable, undimmed and included in form submission.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Disabled reason. Uses aria-disabled and readonly to preserve focus, while blocking edits and excluding the field from submission.</td></tr>
      <tr><td><code>startIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative leading icon component. The icon slot takes precedence.</td></tr>
      <tr><td><code>status</code></td><td><code>TextInputStatus</code></td><td>—</td><td>Error, warning or success, optionally with message and messageId. Error sets aria-invalid.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27; | &#x27;tooltip&#x27;</code></td><td>attached</td><td>Attached, detached or an icon tooltip. All variants describe the input accessibly.</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value: string, event: TextInputChangeEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after a value change. A returned Promise automatically drives pending state.</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>External loading state, combined with pending actions without disabling editing.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Empty-value hint. Does not replace the label.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>Width of the whole field. Numbers are pixels, CSS strings are used unchanged.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>Shows a clear button for nonempty editable values and restores input focus after clearing.</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>Focuses the native input after mounting.</td></tr>
      <tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Native name, taking precedence over a forwarded name and removed when disabled.</td></tr>
      <tr><td><code>autoComplete</code></td><td><code>string</code></td><td>—</td><td>Forwarded unchanged to native autocomplete.</td></tr>
      <tr><td><code>clearLabel</code></td><td><code>string</code></td><td>Clear {label}</td><td>Localized clear-button name.</td></tr>
      <tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>Localized loading-indicator name.</td></tr>
      <tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the field container: the Field box around the label, control box, and status message. Has no effect, and warns in development, where no Field box renders (inside InputGroup and in a horizontal-labels FormLayout).</td></tr>
      <tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the field container. Same targeting as containerClass.</td></tr>
      <tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the control box: the element that paints the border and background and holds the icons and clear button. Never reaches the native input.</td></tr>
      <tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the control box.</td></tr>
    </tbody>
  </table>
</div>

## Status type

```ts
interface TextInputStatus {
  type: 'error' | 'warning' | 'success'
  message?: string
  messageId?: string
}
```

## TextInput Slots

<div class="component-api-table" role="region" aria-label="TextInput Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>Decorative leading icon, overriding startIcon. Keep interactive controls out of this slot.</td></tr>
      <tr><td><code>end</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>Trailing content, including buttons. Consumers provide accessible names.</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>Decorative label icon, overriding the labelIcon prop.</td></tr>
    </tbody>
  </table>
</div>

## TextInput Events

<div class="component-api-table" role="region" aria-label="TextInput Events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: string</code></td><td>—</td><td>v-model update, before change and changeAction.</td></tr>
      <tr><td><code>change</code></td><td><code>value: string, event: TextInputChangeEvent</code></td><td>—</td><td>Emitted after each committed edit or clear. event.preventDefault() skips changeAction without undoing the model update.</td></tr>
      <tr><td><code>enter</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>Enter outside IME composition. Canceled keydown events suppress it.</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>Native keyboard event. PreventDefault() can suppress enter.</td></tr>
      <tr><td><code>clear</code></td><td><code>event: MouseEvent</code></td><td>—</td><td>Clear-button activation. Still emits update:modelValue and change and runs an uncanceled action.</td></tr>
      <tr><td><code>actionError</code></td><td><code>error: unknown, value: string, event: TextInputChangeEvent</code></td><td>—</td><td>Emitted after a synchronous throw or Promise rejection. Pending is cleaned automatically.</td></tr>
    </tbody>
  </table>
</div>

## TextInputChangeEvent

```ts
type TextInputChangeEvent = CustomEvent<{
  value: string
  originalEvent: Event
}>
```

- Native `input` events are usually not cancelable.
- `change` supplies a cancelable component event.
- `event.detail.value` contains the new value.
- `event.detail.originalEvent` contains the original event.
- `changeAction` and `actionError` receive the same component event.

The original event type depends on the action:

| Action | Type |
| --- | --- |
| Enter text | `InputEvent` |
| Confirm input method composition | `CompositionEvent` |
| Click the clear button | `MouseEvent` |

## Async actions

`changeAction` receives the new value and component event. Returning a Promise displays a loading indicator.

- **Editing**: the input remains editable while saving. Clearing the value also runs `changeAction`.
- **Loading**: `aria-busy` stays `true` while any action is unfinished. It clears after all actions settle, including rejected actions.
- **Value updates**: new values from the parent take precedence over temporary display values.
- **Concurrent saves**: cancel older requests or check request versions in your application to prevent stale results from overwriting newer values.
- **Errors**: handle `@action-error` to show a message. To roll back, update the value bound with `v-model`.

## Template refs

Template refs expose these properties and methods:

- `element: HTMLInputElement | null`: the native input element, or `null` before mounting.
- `focus(options?: FocusOptions)`: focuses the input.
- `blur()`: removes focus from the input.
- `select()`: selects all input text.

## Native attributes

- `maxlength`, `minlength`, `pattern`, `required`, `form`, `aria-*`, `data-*` and native event listeners are forwarded to the native `input`.
- `class` and `style` apply to the control box and combine with `controlClass` and `controlStyle`. Use `containerClass` and `containerStyle` for the Field container. `width` applies to the whole `Field`.
- The component manages `value`, `type`, `disabled`, `readonly`, `autofocus` and core ARIA state. Use the corresponding component props.
- `aria-describedby` and `aria-labelledby` merge with the component's internal association IDs.

### Disabled and read-only states

- **Disabled without a reason**: native `disabled` prevents editing, focus and submission of the field.
- **Disabled with `disabledMessage`**: `aria-disabled` and `readonly` preserve focus so the reason can be discovered. The component removes `name` and blocks edits and clearing.
- **Read-only**: the input remains focusable, allows copying and is included in `FormData`.
- Disabled takes precedence when both states are set.

## Theme

Add a class to the component to override theme variables:

```vue
<TextInput v-model="email" class="my-input" label="Email" />
```

```css
.my-input {
  --astryx-input-focus: #10b981;
  --astryx-radius-element: 8px;
}
```

### Appearance and size

- `--astryx-input-background`: input background color.
- `--astryx-input-border`: default border color.
- `--astryx-input-focus`: focus border color when no validation status is set.
- `--astryx-radius-element`: input corner radius.
- `--astryx-input-height-sm`: small height; Neutral defaults to `28px`.
- `--astryx-input-height-md`: medium height; Neutral defaults to `32px`.
- `--astryx-input-height-lg`: large height; Neutral defaults to `36px`.

### Validation states

Each state provides three variables for the border and icon, message text, and message background:

- **Error**: `--astryx-input-error`, `--astryx-input-error-foreground`, `--astryx-input-error-background`.
- **Warning**: `--astryx-input-warning`, `--astryx-input-warning-foreground`, `--astryx-input-warning-background`.
- **Success**: `--astryx-input-success`, `--astryx-input-success-foreground`, `--astryx-input-success-background`.

Override status variables on a parent containing the whole field to style both the input and its status message.

### Color mode

- Neutral selects its colors from CSS `color-scheme`.
- Set `data-astryx-color-mode="light"` on the root element or theme container to use light mode.
- Set `data-astryx-color-mode="dark"` to use dark mode.

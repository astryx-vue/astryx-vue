---
layout: component-docs
title: Number Input
outline: false
footer: false
---

## NumberInput Props

<div class="component-api-table" role="region" aria-label="NumberInput Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Current value. An empty field is <code>null</code>.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Field label, also used as the accessible name.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text under the label.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Placeholder text.</td></tr>
      <tr><td><code>min</code></td><td><code>number | null</code></td><td>—</td><td>Minimum value. On blur or Enter, a smaller entry commits at this value. While typing, it is marked invalid.</td></tr>
      <tr><td><code>max</code></td><td><code>number | null</code></td><td>—</td><td>Maximum value. On blur or Enter, a larger entry commits at this value. While typing, it is marked invalid.</td></tr>
      <tr><td><code>step</code></td><td><code>number | null</code></td><td><code>1</code></td><td>Amount added or removed on each step.</td></tr>
      <tr><td><code>hasNumberSteppers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows increment and decrement buttons at the end of the input. A button is disabled when its step would not change the value.</td></tr>
      <tr><td><code>isWheelEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether scrolling the wheel over the focused input steps the value. Turn it off where page scrolling should always win.</td></tr>
      <tr><td><code>isIntegerOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Only whole numbers commit. Decimal entries stay in the field while editing and are dropped when the field loses focus. The keyboard also switches to the numeric keypad.</td></tr>
      <tr><td><code>formatValue</code></td><td><code>(value: number) =&gt; string</code></td><td>—</td><td>Formats the value shown while the field is not focused, for example <code>(v) =&gt; `${v} items`</code>. Focus shows the raw number so it stays editable, and the formatted text is exposed through <code>aria-valuetext</code>.</td></tr>
      <tr><td><code>units</code></td><td><code>string | null</code></td><td>—</td><td>Unit shown at the end of the input, such as %.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button when the field has a value. The tooltip only says “Clear”; the accessible name includes the field label. Clearing sets the value to <code>null</code>. An emptied draft commits <code>null</code> on blur only when this is on; otherwise it reverts.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Explains why the field is disabled. With <code>isDisabled</code>, the reason shows in a tooltip on hover and keyboard focus, and the input stays focusable through <code>aria-disabled</code> instead of being removed from the tab order.</td></tr>
      <tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the value at full opacity and still submits it, but blocks edits. Arrow keys, the wheel, and the stepper buttons are all off while read-only. <code>isDisabled</code> wins when both are set.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field optional. Mutually exclusive with <code>isRequired</code>.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field required. Mutually exclusive with <code>isOptional</code>.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps the label for screen readers and hides it visually.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip text behind an info icon at the end of the label.</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Icon shown before the label text. The <code>labelIcon</code> slot works too.</td></tr>
      <tr><td><code>startIcon</code></td><td><code>Component</code></td><td>—</td><td>Icon shown at the start of the input. The <code>icon</code> slot works too.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Field size.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field, label and status included. Numbers are pixels, strings are used as-is, such as <code>'100%'</code>.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success' | { type, message? }</code></td><td>—</td><td>Validation status. An object with <code>message</code> shows that text under the field.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>How the status message is placed. <code>'tooltip'</code> hides the message box and reveals it from the status icon instead.</td></tr>
      <tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Form field name.</td></tr>
      <tr><td><code>autoComplete</code></td><td><code>string</code></td><td>—</td><td>Native <code>autocomplete</code> attribute.</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focuses the input after it mounts.</td></tr>
      <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Id for the input element. Generated when omitted.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Same as <code>isDisabled</code>.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Same as <code>disabledMessage</code>.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Same as <code>hasClear</code>.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Same as <code>htmlName</code>.</td></tr>
      <tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the field container. Has no effect, and warns in development, when no Field box renders, including inside InputGroup and a horizontal-labels FormLayout.</td></tr>
      <tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the field container.</td></tr>
      <tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>Class for the number field box. A class written on the component lands here too, with no warning.</td></tr>
      <tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>Inline style for the number field box. A style written on the component lands here too.</td></tr>
    </tbody>
  </table>
</div>

## NumberInput events

<div class="component-api-table" role="region" aria-label="NumberInput events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: number | null</code></td><td>Emitted when the value changes.</td></tr>
      <tr><td><code>change</code></td><td><code>value: number | null</code></td><td>Emitted when the value changes. <code>null</code> means the field was cleared.</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>Emitted when the input receives focus.</td></tr>
      <tr><td><code>blur</code></td><td><code>event: FocusEvent</code></td><td>Emitted when the input loses focus.</td></tr>
      <tr><td><code>enter</code></td><td><code>event: KeyboardEvent</code></td><td>Emitted when Enter is pressed in the input.</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>Emitted on keydown in the input, before the arrow keys step the value. Calling <code>preventDefault()</code> keeps the value unchanged.</td></tr>
    </tbody>
  </table>
</div>

## NumberInput slots

<div class="component-api-table" role="region" aria-label="NumberInput slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>Icon at the start of the input.</td></tr>
      <tr><td><code>labelIcon</code></td><td>Icon before the label text.</td></tr>
    </tbody>
  </table>
</div>

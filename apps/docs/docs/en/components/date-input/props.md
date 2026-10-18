---
layout: component-docs
title: Date Input
outline: false
footer: false
---

## DateInput Props

<div class="component-api-table" role="region" aria-label="DateInput Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>The selected date.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select a date</code> / <code>选择日期</code></td><td>Placeholder text. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>min</code></td><td><code>Date</code></td><td>—</td><td>Earliest selectable date.</td></tr>
      <tr><td><code>max</code></td><td><code>Date</code></td><td>—</td><td>Latest selectable date.</td></tr>
      <tr><td><code>isDateDisabled</code></td><td><code>(date: Date) =&gt; boolean</code></td><td>—</td><td>Return true to disable a date.</td></tr>
      <tr><td><code>dateConstraints</code></td><td><code>Array&lt;(date: Date) =&gt; boolean&gt;</code></td><td>—</td><td>A day is disabled when any function returns false.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Field label.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text under the label.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps the label for screen readers and hides it visually.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>—</td><td>Marks the label as optional.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>—</td><td>Marks the field required and sets aria-required on the input.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Hint shown from the info icon at the end of the label.</td></tr>
      <tr><td><code>format</code></td><td><code>'date' | 'date_long' | 'date_weekday' | 'system_date' | ((iso: string) =&gt; string)</code></td><td><code>'date_long'</code></td><td>How a committed date is displayed. A function receives <code>YYYY-MM-DD</code>.</td></tr>
      <tr><td><code>presentation</code></td><td><code>'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'</code></td><td>adaptive-native when omitted</td><td>Popover, bottom sheet, system date control, or a switch between them based on the pointer. presentation wins when nativePicker is also set.</td></tr>
      <tr><td><code>nativePicker</code></td><td><code>'touch' | 'always' | 'never'</code></td><td>—</td><td>Older surface name. touch follows the pointer, always uses the system control, never keeps the calendar.</td></tr>
      <tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td><code>1</code></td><td>Months shown side by side in the calendar. The system date control cannot express this.</td></tr>
      <tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>—</td><td>First day of the week in the calendar. The system date control cannot express this.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The field cannot be edited and shows a loading indicator.</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value: Date | null) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after the value is committed. A promise keeps the field busy until it settles.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field. A number is pixels.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Explains why the field is disabled. With <code>disabled</code>, the message shows in a tooltip on hover or keyboard focus and the input stays focusable with <code>aria-disabled</code>; the value still cannot change. The older <code>disabledReason</code> name works too.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button when a date is set. Clearing also returns focus to the input. The older <code>clearable</code> name works too.</td></tr>
      <tr><td><code>clearLabel</code></td><td><code>string</code></td><td><code>Clear</code> / <code>清除</code></td><td>Accessible name for the clear button. Includes <code>label</code> when one is set. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Field size.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success' | { type, message? }</code></td><td>—</td><td>Validation status. An object with <code>message</code> shows that text under the field.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits.</td></tr>
    </tbody>
  </table>
</div>

## DateInput events

<div class="component-api-table" role="region" aria-label="DateInput events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: Date | null</code></td><td>Emitted when the date changes.</td></tr>
      <tr><td><code>change</code></td><td><code>value: Date | null</code></td><td>Emitted when the date changes.</td></tr>
    </tbody>
  </table>
</div>

## DateInput slots

<div class="component-api-table" role="region" aria-label="DateInput slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>prefix</code></td><td>Icon shown before the input.</td></tr>
      <tr><td><code>suffix</code></td><td>Content shown after the input.</td></tr>
    </tbody>
  </table>
</div>

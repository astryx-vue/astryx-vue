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
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Field label.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text under the label.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps the label for screen readers and hides it visually.</td></tr>
      <tr><td><code>format</code></td><td><code>'date' | 'date_long' | 'date_weekday' | 'system_date' | ((iso: string) =&gt; string)</code></td><td><code>'date_long'</code></td><td>How a committed date is displayed. A function receives <code>YYYY-MM-DD</code>.</td></tr>
      <tr><td><code>presentation</code></td><td><code>'popover' | 'bottom-sheet' | 'adaptive-bottom-sheet'</code></td><td><code>'popover'</code></td><td>Opens the calendar in a popover, always in a bottom sheet, or in a bottom sheet when the pointer is coarse.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Reason shown while the field is disabled.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button.</td></tr>
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

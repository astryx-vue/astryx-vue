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
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Reason shown while the field is disabled.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button.</td></tr>
      <tr><td><code>clearLabel</code></td><td><code>string</code></td><td><code>Clear</code> / <code>清除</code></td><td>Accessible name for the clear button. Includes <code>label</code> when one is set. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Field size.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success'</code></td><td><code>'default'</code></td><td>Validation status.</td></tr>
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

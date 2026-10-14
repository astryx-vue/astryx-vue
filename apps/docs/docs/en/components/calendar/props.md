---
layout: component-docs
title: Calendar
outline: false
footer: false
---

## Calendar Props

<div class="component-api-table" role="region" aria-label="Calendar Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>The selected date.</td></tr>
      <tr><td><code>mode</code></td><td><code>'single' | 'range'</code></td><td><code>'single'</code></td><td>Select one day, or a start and end.</td></tr>
      <tr><td><code>range</code></td><td><code>{ start: Date | null, end: Date | null } | null</code></td><td><code>null</code></td><td>Range value. Bind with <code>v-model:range</code>.</td></tr>
      <tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td><code>1</code></td><td>How many months to show side by side.</td></tr>
      <tr><td><code>focusDate</code></td><td><code>Date</code></td><td>—</td><td>Month to show first.</td></tr>
      <tr><td><code>min</code></td><td><code>Date</code></td><td>—</td><td>Earliest selectable date.</td></tr>
      <tr><td><code>max</code></td><td><code>Date</code></td><td>—</td><td>Latest selectable date.</td></tr>
      <tr><td><code>isDateDisabled</code></td><td><code>(date: Date) =&gt; boolean</code></td><td>—</td><td>Return true to disable a date.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td><code>Calendar</code> / <code>日历</code></td><td>Accessible name for the calendar. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the whole calendar.</td></tr>
    </tbody>
  </table>
</div>

## Calendar events

<div class="component-api-table" role="region" aria-label="Calendar events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: Date | null</code></td><td>Emitted when the selected date changes.</td></tr>
      <tr><td><code>update:range</code></td><td><code>value: { start: Date | null, end: Date | null }</code></td><td>Emitted when the range changes.</td></tr>
      <tr><td><code>change</code></td><td><code>value: Date | null</code></td><td>Emitted when the selected date changes.</td></tr>
    </tbody>
  </table>
</div>

## Calendar slots

<div class="component-api-table" role="region" aria-label="Calendar slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Props</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>header</code></td><td>—</td><td>Custom month header.</td></tr>
      <tr><td><code>day</code></td><td><code>{ date, isSelected, isDisabled, isToday, isInMonth }</code></td><td>Custom day cell.</td></tr>
    </tbody>
  </table>
</div>

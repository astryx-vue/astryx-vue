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
      <tr><td><code>modelValue</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Current value.</td></tr>
      <tr><td><code>min</code></td><td><code>number</code></td><td>—</td><td>Minimum value.</td></tr>
      <tr><td><code>max</code></td><td><code>number</code></td><td>—</td><td>Maximum value.</td></tr>
      <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Amount added or removed on each step.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the field.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Reason shown while the field is disabled.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Field size.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Placeholder text.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Field label, also used as the accessible name.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text under the label.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps the label for screen readers and hides it visually.</td></tr>
      <tr><td><code>units</code></td><td><code>string</code></td><td>—</td><td>Unit shown before the stepper, such as %.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button when the field has a value.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success' | { type, message? }</code></td><td>—</td><td>Validation status. An object with <code>message</code> shows that text under the field.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name.</td></tr>
    </tbody>
  </table>
</div>

## NumberInput events

<div class="component-api-table" role="region" aria-label="NumberInput events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: number | null</code></td><td>Emitted when the value changes.</td></tr>
      <tr><td><code>change</code></td><td><code>value: number | null</code></td><td>Emitted when the value changes.</td></tr>
    </tbody>
  </table>
</div>

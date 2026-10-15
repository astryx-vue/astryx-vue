---
layout: component-docs
title: Input Group
outline: false
footer: false
---

## InputGroup Props

<div class="component-api-table" role="region" aria-label="InputGroup Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the group, passed through to the controls inside it.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name. When set, the group shows a label, description, optional or required mark, and status.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the label visually. Screen readers still read it.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Help text between the label and the control.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the group and the selectors inside it.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the label as optional.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the label as required.</td></tr>
      <tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status on the group border and under the control.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip at the end of the label.</td></tr>
    </tbody>
  </table>
</div>

## InputGroup slots

<div class="component-api-table" role="region" aria-label="InputGroup slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>The input control in the middle.</td></tr>
      <tr><td><code>before</code></td><td>Text, icon, or button shown before the input.</td></tr>
      <tr><td><code>after</code></td><td>Text, icon, or button shown after the input.</td></tr>
    </tbody>
  </table>
</div>

## InputGroupText

Fixed text inside an addon. It has no props of its own. Put the text in the default slot.

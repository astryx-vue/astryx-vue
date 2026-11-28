---
layout: component-docs
title: Form Layout
outline: false
footer: false
---

## Form Layout Props

<div class="component-api-table" role="region" aria-label="Form Layout Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>direction</code></td>
        <td><code>'vertical' | 'horizontal' | 'horizontal-labels'</code></td>
        <td><code>'vertical'</code></td>
        <td>How the fields are arranged. <code>horizontal</code> uses equal columns. <code>horizontal-labels</code> puts the label on the left and stacks below 480px.</td>
      </tr>
      <tr>
        <td><code>defaultOptionality</code></td>
        <td><code>'optional' | 'required'</code></td>
        <td>-</td>
        <td>Default for fields that do not set <code>isOptional</code> or <code>isRequired</code>. It changes the indicator and <code>aria-required</code>. It does not set the native <code>required</code> attribute. When a field sets both, optional wins. Checkboxes and switches are the exception: an unchecked box or an off switch is an answer, so they take no required state from the default and are required only through their own <code>isRequired</code>.</td>
      </tr>
      <tr>
        <td><code>defaultEntryErrorBehavior</code></td>
        <td><code>'complete' | 'blur-or-enter'</code></td>
        <td>-</td>
        <td>Default <code>entryErrorBehavior</code> for the date and time fields inside (DateInput, DateTimeInput, TimeInput). NumberInput takes the prop too but reads no default, since a typed number is complete only at Enter or blur. A field's own setting wins; without either, fields use <code>complete</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Form Layout Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The fields. A nested <code>FormLayout</code> keeps its own direction.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

`FormLayout` renders a `<div>`, not a `<form>`.

The following go to that element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` is merged. The root sets `data-direction`.

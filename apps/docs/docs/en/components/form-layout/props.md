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
        <td>Default for fields that do not set <code>isOptional</code> or <code>isRequired</code>. It changes the indicator and <code>aria-required</code>. It does not set the native <code>required</code> attribute. When a field sets both, optional wins.</td>
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

`FormLayout` renders a `<div>`, not a `<form>`. HTML attributes, <code>aria-*</code>, <code>data-*</code>, <code>class</code>, and <code>style</code> go to that element. <code>class</code> is merged. The root sets <code>data-direction</code>.

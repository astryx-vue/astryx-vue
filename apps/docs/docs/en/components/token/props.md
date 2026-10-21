---
layout: component-docs
title: Token
outline: false
footer: false
---

## Token Props

<div class="component-api-table" role="region" aria-label="Token Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Text, also the accessible name.</td></tr>
      <tr><td><code>color</code></td><td><code>'default' | 'gray' | 'blue' | 'cyan' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple'</code></td><td><code>'default'</code></td><td>Color.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size.</td></tr>
      <tr><td><code>removable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a focusable remove button.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the token. The remove button stops responding.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Render a link. With a remove button, the link and button are siblings.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Extra text for assistive technology.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the text visually while keeping the accessible name. <code>labelHidden</code> is the older name; either one hides it.</td></tr>
    </tbody>
  </table>
</div>

## Token Emits

<div class="component-api-table" role="region" aria-label="Token Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>remove</code></td><td><code>event: Event</code></td><td>Click the remove button, or press Backspace / Delete on the token.</td></tr>
    </tbody>
  </table>
</div>

## Token Slots

<div class="component-api-table" role="region" aria-label="Token Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>Icon before the text.</td></tr>
      <tr><td><code>end</code></td><td>—</td><td>Content after the text and before the remove button. Also available as <code>endContent</code>.</td></tr>
    </tbody>
  </table>
</div>

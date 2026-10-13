---
layout: component-docs
title: Toggle Button Group
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name, rendered as <code>aria-label</code>.</td></tr>
      <tr><td><code>type</code></td><td><code>'single' | 'multiple'</code></td><td><code>'single'</code></td><td><code>single</code> keeps one member pressed. <code>multiple</code> presses members independently.</td></tr>
      <tr><td><code>value</code></td><td><code>string | null | string[]</code></td><td><code>null</code></td><td>The pressed member, or the list of them. Bind with <code>v-model:value</code>.</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Layout direction.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size the members inherit. A member's own <code>size</code> wins.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables every member. A member can still disable itself.</td></tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:value</code></td><td><code>string | null | string[]</code></td><td>The next selection.</td></tr>
      <tr><td><code>change</code></td><td><code>string | null | string[]</code></td><td>Emitted with <code>update:value</code>.</td></tr>
    </tbody>
  </table>
</div>

## Slots

The default slot is the `ToggleButton` members. Each member that participates needs a `value`.

---
layout: component-docs
title: Collapsible Group
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="CollapsibleGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>type</code></td><td><code>'single' | 'multiple'</code></td><td><code>'single'</code></td><td><code>single</code> keeps one section open. <code>multiple</code> toggles each section on its own.</td></tr>
      <tr><td><code>defaultValue</code></td><td><code>string | string[]</code></td><td>-</td><td>Open section when the group owns its state.</td></tr>
      <tr><td><code>value</code></td><td><code>string | string[]</code></td><td>-</td><td>Controlled open section. Bind with <code>v-model:value</code>.</td></tr>
      <tr><td><code>hasDividers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Draw a hairline between sections.</td></tr>
      <tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code> with dividers</td><td>Trigger and content padding.</td></tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="CollapsibleGroup Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:value</code></td><td><code>string | string[]</code></td><td>The next open value. Single mode uses <code>''</code> when everything is closed.</td></tr>
      <tr><td><code>change</code></td><td><code>string | string[]</code></td><td>Emitted with <code>update:value</code>.</td></tr>
    </tbody>
  </table>
</div>

## Slots

The default slot is the `Collapsible` sections. Each one needs a `value`.

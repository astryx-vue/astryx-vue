---
layout: component-docs
title: Toolbar
outline: false
footer: false
---

## Toolbar Props

<div class="component-api-table" role="region" aria-label="Toolbar Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name of the toolbar.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Height.</td></tr>
      <tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td><code>1</code></td><td>Space between items in a group, on the spacing scale.</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Axis the arrow keys follow.</td></tr>
    </tbody>
  </table>
</div>

## Toolbar slots

<div class="component-api-table" role="region" aria-label="Toolbar slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>start</code></td><td>Actions on the leading side.</td></tr>
      <tr><td><code>center</code></td><td>Actions in the middle. Turns the bar into a three-column grid.</td></tr>
      <tr><td><code>end</code></td><td>Actions on the trailing side.</td></tr>
    </tbody>
  </table>
</div>

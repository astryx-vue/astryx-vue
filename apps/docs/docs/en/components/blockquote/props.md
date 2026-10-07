---
layout: component-docs
title: Blockquote
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Blockquote Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>cite</code></td><td><code>string | number</code></td><td>—</td><td>Optional author or source rendered inside semantic <code>&lt;footer&gt;</code> and <code>&lt;cite&gt;</code> elements.</td></tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Blockquote slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>The quoted content.</td></tr>
      <tr><td><code>cite</code></td><td>Rich attribution content. When provided, it overrides the cite prop.</td></tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is `<blockquote>`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

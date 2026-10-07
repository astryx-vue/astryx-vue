---
layout: component-docs
title: Visually Hidden
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="VisuallyHidden Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'span'</code></td><td>Root HTML element or Vue component. Use <code>div</code> for a live region or block content.</td></tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="VisuallyHidden slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Content exposed to assistive technology while hidden visually. This slot is required.</td></tr>
    </tbody>
  </table>
</div>

## Template ref

The component exposes `element` with type `HTMLElement | null`.
`element` points to the rendered root element.

## Styling constraints

- The component ignores incoming `class`.
- The component ignores incoming `style`.
- External styles cannot replace the fixed hiding rules.

## Native attributes

The root element receives:

- `aria-*` attributes.
- `role`.
- `id`.
- `data-*` attributes.
- Native event listeners.

:::warning Hidden content
Do not put interactive controls inside `VisuallyHidden`. The visual interface cannot show those controls.

To hide content from all users, use conditional rendering or the native `hidden` attribute.
:::

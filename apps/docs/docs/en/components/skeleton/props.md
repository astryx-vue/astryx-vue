---
layout: component-docs
title: Skeleton
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Skeleton Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td><code>'100%'</code></td><td>Placeholder width. Numbers are interpreted as pixels. Strings are preserved as CSS dimensions.</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td><code>'100%'</code></td><td>Placeholder height. Numbers are interpreted as pixels. Strings are preserved as CSS dimensions.</td></tr>
      <tr><td><code>radius</code></td><td><code>'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'</code></td><td><code>3</code></td><td>Design-token radius step. Use <code>none</code> for square corners and <code>rounded</code> for a fully rounded shape.</td></tr>
      <tr><td><code>index</code></td><td><code>number</code></td><td><code>0</code></td><td>Stagger index. Each increment delays the animation by 100ms.</td></tr>
    </tbody>
  </table>
</div>

## Accessibility

- `Skeleton` sets `aria-hidden="true"` by default.
- Assistive technology does not read the default placeholders.
- Give the surrounding loading region an accessible name.
- Set `aria-busy="true"` on that region.
- If the system requests reduced motion, the pulse animation stops.
- In forced-colors mode, placeholders remain visible.

## Native attributes

The root element is `<div>`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

An explicit `aria-hidden` value overrides the default.

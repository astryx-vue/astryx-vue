---
layout: component-docs
title: Badge
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Badge Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>BadgeVariant</code></td>
        <td><code>'neutral'</code></td>
        <td>Sets the visual variant of the badge. Optional: neutral, info, success, warning, error, blue, cyan, green, orange, pink, purple, red, teal, yellow.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Badge text. Give the text here or through the default slot; the slot wins when both are set. A badge is one line and at least as tall as that line, so it grows with a larger text size. It is as wide as its label, so it does not stretch to fill a grid cell or a stack; a label wider than the space available ends in an ellipsis, and a string or number label is also set as the title.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Badge slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>default</code></td><td>Text content displayed by the badge.</td></tr>
      <tr><td><code>icon</code></td><td>Optional leading icon. An icon should not replace the text label.</td></tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is `<span>`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

`Badge` is a read-only indicator. Do not add interactive behavior.

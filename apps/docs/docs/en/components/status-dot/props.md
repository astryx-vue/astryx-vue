---
layout: component-docs
title: Status Dot
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="StatusDot Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>StatusDotVariant</code></td>
        <td><code>'neutral'</code></td>
        <td>The semantic color variant of the status dot. Optional: <code>neutral</code>, <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Required accessible label. Announced by screen readers via <code>aria-label</code>.</td>
      </tr>
      <tr>
        <td><code>isPulsing</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the dot pulses to indicate an active state.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is a `<span>`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

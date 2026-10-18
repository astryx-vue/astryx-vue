---
layout: component-docs
title: Selector Option
outline: false
footer: false
---

## Props

The fields of a `SelectorOption` object. These are data, not attributes: they go into the `options` array of a [Selector](/en/components/selector), or arrive in the `option` slot.

<div class="component-api-table" role="region" aria-label="SelectorOption fields" tabindex="0">
<table><thead><tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>The value the selector reports when this option is chosen. Required, and unique inside one list.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Primary text of the row, and its accessible name. Required.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Secondary text under the label. Its own line, smaller and quieter than the label.</td></tr>
<tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>Icon drawn before the label, given as a CSS icon class such as <code>i-carbon-user</code>.</td></tr>
<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Keeps the option in the list but stops it from being chosen. The arrows skip it.</td></tr>
</tbody></table>
</div>

## Slots

The `option` slot of a `Selector` replaces the content of one row. It receives `option` (the object above), `isActive` (the row the pointer or keyboard is on), and `isSelected`.

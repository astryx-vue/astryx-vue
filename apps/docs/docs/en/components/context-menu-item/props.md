---
layout: component-docs
title: Context Menu Item
outline: false
footer: false
---

## ContextMenuItem Props

<div class="component-api-table" role="region" aria-label="ContextMenuItem Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>Primary label of the row. Use the <code>label</code> slot for rich content.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Secondary text rendered below the label. Use the <code>description</code> slot for rich content.</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>Icon rendered before the label: a CSS icon class or a component that draws the SVG. Use the <code>icon</code> slot for arbitrary content.</td></tr>
<tr><td><code>endContent</code></td><td><code>string | number</code></td><td>—</td><td>Plain text rendered after the label area. Use the <code>endContent</code> slot for rich trailing content such as a badge.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Address the row navigates to; the row then renders as an anchor.</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>Link target, only used with <code>href</code>.</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link relationship, only used with <code>href</code>.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the row is disabled. A disabled row is dimmed, skipped by arrow keys and typeahead, and cannot be activated.</td></tr>
<tr><td><code>hasCloseOnSelect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether activating the row closes the menu.</td></tr>
<tr><td><code>variant</code></td><td><code>'default' | 'destructive'</code></td><td><code>'default'</code></td><td>Visual variant of the row.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ContextMenuItem events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>Fired when the row is activated, with the click that activated it.</td></tr>
</tbody></table>
</div>

## Slots

- `label`: rich content replacing the `label` prop.
- `icon`: leading content replacing the `icon` prop.
- `description`: rich content replacing the `description` prop.
- `endContent`: trailing content after the label area.

The row is `role="menuitem"`, so the keyboard belongs to the menu above it: arrow keys, `Home`, `End`, and typeahead move between rows.

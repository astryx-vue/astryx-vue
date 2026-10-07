---
layout: component-docs
title: Button Group
outline: false
footer: false
---

## ButtonGroup Props

<div class="component-api-table" role="region" aria-label="ButtonGroup Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>required</td><td>Accessible name for the group.</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Connected direction and arrow-key navigation axis.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Default inherited by child buttons. An explicit child size wins.</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>Shadow depth for the connected surface.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables every Button and IconButton in the group.</td></tr>
    </tbody>
  </table>
</div>

## Slot

ButtonGroup receives Button or IconButton through its required default slot.

## Keyboard navigation

| Key | Behavior |
| --- | --- |
| Left and Right Arrow | Move focus within a horizontal group. |
| Up and Down Arrow | Move focus within a vertical group. |
| `Home` | Focus the first available button. |
| `End` | Focus the last available button. |

- Keyboard navigation skips disabled buttons.
- Right-to-left horizontal layouts reverse the Left and Right Arrow behavior.

## Template ref

`ButtonGroup` exposes `element`.
Its type is `HTMLDivElement | null`.

## Native attributes

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

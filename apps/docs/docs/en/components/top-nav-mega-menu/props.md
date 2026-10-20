---
layout: component-docs
title: Top Nav Mega Menu
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenu props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Visible label for the trigger button. Required.</td></tr>
<tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Delay in milliseconds before showing the menu on hover.</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>250</code></td><td>Delay in milliseconds before hiding the menu after the pointer leaves.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires when the mega menu opens or closes. Useful for coordinating wrapper styles.

## Slots

- `default`: menu items. Typically `TopNavMegaMenuItem` components, but any content works.
- `featured`: featured content. Rendered as the right-hand panel on desktop, and below the items in the mobile drawer.

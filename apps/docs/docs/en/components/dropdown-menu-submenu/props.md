---
layout: component-docs
title: Dropdown Menu Submenu
outline: false
footer: false
---

## DropdownMenuSubMenu Props

<div class="component-api-table" role="region" aria-label="DropdownMenuSubMenu Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>The row's text, and the parent name used by the Back row of the next level.</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>Secondary line under the label.</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>Icon before the label.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The row cannot open the next level.</td></tr>
<tr><td><code>hasSpinner</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Replaces the caret with a spinner while the next level is loading. The spinner is decorative and does not block opening.</td></tr>
<tr><td><code>menuWidth</code></td><td><code>number | string</code></td><td>—</td><td>Width of the flyout. A number is pixels, used as a minimum and capped to the viewport. An intrinsic keyword becomes the preferred width. Unused while drilled in.</td></tr>
<tr><td><code>presentation</code></td><td><code>'flyout' | 'drill-in' | 'adaptive'</code></td><td><code>'adaptive'</code></td><td>How the next level appears: beside the row, in place of the current rows, or chosen when the menu opens from whether the surface is a compact touch screen.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="DropdownMenuSubMenu events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>openChange</code></td><td><code>boolean</code></td><td>Fired when the flyout or the drilled view opens or closes.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the rows of the nested menu — action rows, checkbox rows, radio groups, and deeper submenus.
- `icon`: arbitrary leading content, replacing the `icon` prop.
- `label`: rich content replacing the `label` prop.
- `description`: rich content replacing the `description` prop.

## Row element

The row is the element carrying `role="menuitem"` and `aria-haspopup="menu"`. A row that navigates is not this component: a submenu row always opens the next level, so put the address on the rows inside it.

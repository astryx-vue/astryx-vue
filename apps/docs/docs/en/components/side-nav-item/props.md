---
layout: component-docs
title: Side Nav Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SideNavItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Visible name of the item. Becomes the accessible name of the icon-only row and of the collapsed popover. Required.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Navigation target URL. Without it the row is a button that only emits <code>click</code>.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Custom link root component, such as <code>RouterLink</code>. It receives the address as <code>to</code> as well. Used only when there is an address.</td></tr>
<tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>Link <code>target</code>. A new-window target also adds <code>noopener noreferrer</code>.</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link <code>rel</code>. Merged with the <code>noopener noreferrer</code> that a new-window target adds.</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>Icon before the label, given as a CSS icon class such as <code>i-carbon-home</code>. An item without an icon is left out while the rail is collapsed.</td></tr>
<tr><td><code>selectedIconClass</code></td><td><code>string</code></td><td>—</td><td>Icon used instead of <code>iconClass</code> while the item is selected.</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether this is the current page. Sets <code>aria-current="page"</code> and the selected styles.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the item is disabled. Blocks the default action and emits nothing.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Height and horizontal padding of the row.</td></tr>
<tr><td><code>collapsible</code></td><td><code>boolean | { defaultIsCollapsed?: boolean, isCollapsed?: boolean }</code></td><td>—</td><td>Whether the children can be folded. Left unset, a row with children folds. <code>false</code> keeps them open. The object form sets the starting or the controlled state.</td></tr>
</tbody></table>
</div>

## Events

- `click(event: MouseEvent)`: fires when the row is clicked. A disabled item blocks the default action and emits nothing.

## Slots

- `default`: child items. A row with children folds them into a group.
- `icon`: icon element before the label. An alternative to `iconClass`.
- `selectedIcon`: icon element used while the item is selected. Falls back to `icon`.
- `end`: content at the trailing edge of the row, such as a badge or a count.

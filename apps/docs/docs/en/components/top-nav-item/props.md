---
layout: component-docs
title: Top Nav Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TopNavItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible label for the nav item. Rendered as visible text by default. When <code>isIconOnly</code> is true, it becomes the <code>aria-label</code> instead. Required.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Navigation target URL.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Custom link root component, such as <code>RouterLink</code>. It receives the address as <code>to</code> as well. Used only when there is an address.</td></tr>
<tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>Link <code>target</code>. A new-window target also adds <code>noopener noreferrer</code>.</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link <code>rel</code>. Merged with the <code>noopener noreferrer</code> that a new-window target adds.</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>Icon shown before the label, given as a CSS icon class such as <code>i-carbon-home</code>.</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether this nav item is currently selected. Sets <code>aria-current="page"</code> and applies highlighted styles.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the nav item is disabled. Sets <code>aria-disabled</code>, drops href/target so the item cannot navigate, and prevents interaction.</td></tr>
<tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders the item as a square icon-only element. When true, <code>label</code> becomes the <code>aria-label</code> and the visible text is hidden. Inside the mobile drawer the label is shown again.</td></tr>
<tr><td><code>size</code></td><td><code>NavItemSize</code></td><td><code>'md'</code></td><td>Height and horizontal padding of the item: <code>'sm'</code> is 28px, <code>'md'</code> 32px, <code>'lg'</code> 36px.</td></tr>
</tbody></table>
</div>

## Events

- `click(event: MouseEvent)`: fires when the item is clicked. A disabled item blocks the default action and emits nothing.

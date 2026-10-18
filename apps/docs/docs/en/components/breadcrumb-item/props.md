---
layout: component-docs
title: Breadcrumb Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="BreadcrumbItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Link URL. Omit it and the crumb is a button. Mutually exclusive with <code>menu</code>: a menu crumb is a trigger, not a link.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root component, such as a router link. Used instead of <code>a</code> for items that have an <code>href</code> and are not current.</td></tr>
<tr><td><code>isCurrent</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks this crumb as the current page. Renders as a <code>&lt;span&gt;</code> with <code>aria-current="page"</code>. A current crumb can still open a menu.</td></tr>
<tr><td><code>menu</code></td><td><code>BreadcrumbMenuOption[]</code></td><td>—</td><td>Turns the crumb into a menu trigger for sibling destinations. The array matches the dropdown menu's data entries, including dividers, checkbox rows, and radio groups. Ignored when the <code>menu</code> slot is used.</td></tr>
<tr><td><code>menuSize</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>sm</code> on the supporting variant, otherwise <code>md</code></td><td>Size of the menu rows.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the crumb label.
- `startIcon`: icon before the label.
- `menu`: menu content written by hand, including checkbox and radio rows. Used instead of the `menu` array.

## Events

- `click(event: MouseEvent)`: fires when the crumb is clicked. A current crumb blocks the default action and emits nothing.

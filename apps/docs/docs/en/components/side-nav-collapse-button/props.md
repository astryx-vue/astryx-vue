---
layout: component-docs
title: Side Nav Collapse Button
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SideNavCollapseButton props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Button text. When set, the icon-only square becomes a text button with the label before the arrow. Left unset, the accessible name follows the state: expand the sidebar or collapse the sidebar.</td></tr>
<tr><td><code>isCollapsed</code></td><td><code>boolean</code></td><td>—</td><td>Controlled collapsed state, for a button placed outside a <code>SideNav</code>. Bind it with <code>v-model:is-collapsed</code> and give the same value to the <code>SideNav</code>, so the two agree.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'sm'</code> inside a <code>SideNav</code>, otherwise <code>'md'</code></td><td>Button size. The default follows the container.</td></tr>
</tbody></table>
</div>

## Events

- `update:isCollapsed(isCollapsed: boolean)`: fires when the button is clicked while `isCollapsed` is bound. Inside a `SideNav` the click goes to the sidebar's own toggle instead.

## Slots

- `default`: replaces the arrow and the label. A custom icon or a different arrangement goes here.

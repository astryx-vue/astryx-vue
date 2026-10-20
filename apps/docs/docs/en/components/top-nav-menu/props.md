---
layout: component-docs
title: Top Nav Menu
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TopNavMenu props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Text on the trigger button. Required.</td></tr>
<tr><td><code>items</code></td><td><code>readonly TopNavMenuItem[]</code></td><td>—</td><td>Entries of the popover menu. When the entries need custom content, write <code>NavMenuItem</code> elements in the default slot instead.</td></tr>
<tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait before the menu opens on hover, in milliseconds.</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>Wait before the menu closes after the pointer leaves, in milliseconds.</td></tr>
</tbody></table>
</div>

## TopNavMenuItem fields

<div class="component-api-table" role="region" aria-label="TopNavMenuItem fields" tabindex="0">
<table><thead><tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Item text. Required.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supporting line under the text.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Renders the item as a link when set. Without it, the item is a plain menu entry.</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>CSS class of the icon in front of the text.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled entry. Arrow keys and typeahead skip it.</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Stable key for the entry. The label is used when it is empty.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires with `true` when the menu opens and `false` when it closes.

## Slots

- `default`: extra entries rendered as menu items, for example `NavMenuItem` elements.

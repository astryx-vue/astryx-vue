---
layout: component-docs
title: Top Nav Mega Menu Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenuItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Display title for the menu item. Required.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Optional description text displayed below the title.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>URL to navigate to when clicked. Without it the item renders as a button.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td>—</td><td>Custom component to render instead of <code>&lt;a&gt;</code> for link items. Overrides the provider-level default set by <code>LinkProvider</code>.</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>CSS icon class drawn in the leading icon box. The <code>icon</code> slot takes precedence.</td></tr>
</tbody></table>
</div>

## Events

The item emits no events of its own. A click closes the surrounding <code>TopNavMegaMenu</code>, and navigation goes through <code>href</code> or the component passed to <code>as</code>.

## Slots

- `icon`: icon content placed ahead of the title. Replaces the glyph from `iconClass`. Hidden from assistive technology, so the title carries the meaning.

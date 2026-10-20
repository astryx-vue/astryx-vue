---
layout: component-docs
title: Side Nav Heading
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SideNavHeading props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>heading</code></td><td><code>string</code></td><td>—</td><td>Product or app name. Also the accessible name of the icon-only heading shown while the rail is collapsed. Required.</td></tr>
<tr><td><code>headingHref</code></td><td><code>string</code></td><td>—</td><td>Link for the heading text, such as the product home. With no menu, the whole heading becomes one link.</td></tr>
<tr><td><code>superheading</code></td><td><code>string</code></td><td>—</td><td>Small line above the heading, such as the suite name.</td></tr>
<tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>—</td><td>Link for the line above the heading. With a menu it stays an independent link.</td></tr>
<tr><td><code>subheading</code></td><td><code>string</code></td><td>—</td><td>Small line below the heading, such as the current account.</td></tr>
<tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>—</td><td>Link for the line below the heading. With a menu it stays an independent link.</td></tr>
<tr><td><code>logoLabel</code></td><td><code>string</code></td><td><code>heading</code></td><td>Accessible name for the icon when it is a link of its own and no readable text sits beside it.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Custom link root component, such as <code>RouterLink</code>. It receives the address as <code>to</code> as well. Used only when there is an address.</td></tr>
</tbody></table>
</div>

## Slots

- `icon`: mark before the text. A `NavIcon`, an image, or any element. Collapsed, it becomes the whole heading.
- `menu`: popover content for the heading. A chevron appears automatically. Without an address the whole heading opens the menu; with one the links stay independent. Receives `close` and `focusRequest`.
- `end`: content at the trailing edge of the heading row, such as a badge.

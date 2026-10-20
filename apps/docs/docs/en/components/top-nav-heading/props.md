---
layout: component-docs
title: Top Nav Heading
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TopNavHeading props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>heading</code></td><td><code>string</code></td><td>—</td><td>Product/app name displayed as the primary heading text.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Alias of <code>headingHref</code>, so the top bar and the side nav heading take the same prop. <code>headingHref</code> wins when both are set.</td></tr>
<tr><td><code>headingHref</code></td><td><code>string</code></td><td>—</td><td>Link for the heading text (e.g. product home). When no menu is present and this is the only href, the whole heading becomes one clickable link.</td></tr>
<tr><td><code>superheading</code></td><td><code>string</code></td><td>—</td><td>Text above the heading (e.g. suite name). Rendered in a smaller secondary style.</td></tr>
<tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>—</td><td>Link for the superheading text (e.g. suite home). When provided alongside a menu, renders as an independent inline link.</td></tr>
<tr><td><code>subheading</code></td><td><code>string</code></td><td>—</td><td>Text below the heading (e.g. account context). Rendered in a smaller secondary style.</td></tr>
<tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>—</td><td>Link for the subheading text. When provided alongside a menu, renders as an independent inline link.</td></tr>
<tr><td><code>logoLabel</code></td><td><code>string</code></td><td><code>heading</code></td><td>Accessible name for the logo when it is a link of its own and there is no readable text beside it. Ignored when the logo is not a link.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Custom link root component, such as <code>RouterLink</code>. Used only when there is an address. It receives the <code>href</code> and slot content.</td></tr>
</tbody></table>
</div>

## Slots

- `logo`: logo rendered before the heading text. An image, a `NavIcon`, or any element.
- `icon`: same place as `logo`. `logo` wins when both are passed.
- `end`: content at the trailing edge of the heading row, such as a badge.
- `menu`: menu content shown in a popover. A chevron indicator appears automatically. With no href the whole header opens the menu; with hrefs the links are independent and the chevron area opens it. Receives `close` and `focusRequest`.

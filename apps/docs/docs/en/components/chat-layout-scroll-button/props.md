---
layout: component-docs
title: Chat Layout Scroll Button
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatLayoutScrollButton props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isVisible</code></td><td><code>boolean</code></td><td>—</td><td>Required. Whether the pill is shown. The button stays mounted while hidden so it can fade, and is <code>inert</code> so it takes no focus.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Scroll to bottom”</td><td>Expands the pill and shows this text. Omit it for the icon-only down arrow.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ChatLayoutScrollButton events" tabindex="0">
<table><thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>click</code></td><td>—</td><td>The button was activated. ChatLayout uses it to dismiss the new-message label and scroll down.</td></tr>
</tbody></table>
</div>

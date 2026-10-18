---
layout: component-docs
title: Chat System Message
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatSystemMessage props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'default' | 'divider'</code></td><td><code>'default'</code></td><td><code>'default'</code> renders a centered line. <code>'divider'</code> draws a rule on each side with the text as its label, for date separators and section breaks.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the message text, or the divider label. Required.
- `icon`: icon before the text. Ignored for the divider variant. Wrap it in `Icon` for consistent sizing.

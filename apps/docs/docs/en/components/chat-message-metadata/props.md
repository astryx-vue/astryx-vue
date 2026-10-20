---
layout: component-docs
title: Chat Message Metadata
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatMessageMetadata props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>timestamp</code></td><td><code>string</code></td><td>—</td><td>Time or other short text, at the start of the row.</td></tr>
<tr><td><code>footer</code></td><td><code>string</code></td><td>—</td><td>Secondary text between the timestamp and the status, such as a model name.</td></tr>
<tr><td><code>status</code></td><td><code>'sending' | 'sent' | 'delivered' | 'read' | 'error'</code></td><td>—</td><td>Delivery state. Renders a localized icon and label. The row renders nothing when <code>timestamp</code>, <code>footer</code>, and <code>status</code> are all absent.</td></tr>
</tbody></table>
</div>

## Slots

- `timestamp`: replaces the `timestamp` prop. Use it to put a `Timestamp` component in place of plain text.
- `footer`: replaces the `footer` prop. Use it for buttons such as copy, retry, and reactions; each control needs its own accessible name.

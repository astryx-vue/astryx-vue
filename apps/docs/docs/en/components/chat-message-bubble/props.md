---
layout: component-docs
title: Chat Message Bubble
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatMessageBubble props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'filled' | 'ghost'</code></td><td><code>'filled'</code></td><td><code>'filled'</code> paints the sender-colored background. <code>'ghost'</code> keeps the padding and drops the background, so mixed content still lines up. A bubble whose only child is a code block, or an element with class <code>astryx-chat-card</code>, drops the padding and background so the card lines up with the bubble.</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Sender name rendered above the bubble, aligned to the bubble inline padding. Use it on the first bubble of a message; when the first content is raw, use <code>ChatMessage</code>'s <code>name</code> instead.</td></tr>
<tr><td><code>group</code></td><td><code>'first' | 'middle' | 'last'</code></td><td>—</td><td>Position within a multi-bubble group. Tightens the corner radius on the sender side. Leave it unset for a standalone bubble.</td></tr>
<tr><td><code>width</code></td><td><code>string</code></td><td>—</td><td>Overrides the default cap of <code>max(80%, 280px)</code>. Pass <code>100%</code> when in-bubble content should span the message column. Combine it with <code>variant="ghost"</code> for artifact cards and attachments.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: bubble body. Plain text, markdown, or any element. The bubble only supplies the surface.
- `name`: replaces the `name` prop.
- `metadata`: rendered below the bubble, aligned to the bubble padding. Use it on the last bubble of a message; when the last content is raw, use `ChatMessage`'s `metadata` slot instead.

## Exposed

- `element`: the bubble surface element.

---
layout: component-docs
title: Chat Message
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatMessage props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>sender</code></td><td><code>'user' | 'assistant' | 'system'</code></td><td>—</td><td>Who sent this message: controls alignment and layout. Required. A <code>system</code> row is centered and ignores the avatar, name, and metadata slots.</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Plain sender name rendered above the body. Use it when the first child is raw content, not a bubble; with bubbles, set the name on the first bubble instead so it lines up with the bubble padding.</td></tr>
<tr><td><code>density</code></td><td><code>ChatDensity</code></td><td>list value, then <code>'balanced'</code></td><td>Visual density: <code>'compact'</code>, <code>'balanced'</code>, or <code>'spacious'</code>. Inherited from the surrounding <code>ChatMessageList</code> when not set.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: message content: bubbles, tool calls, reasoning, or raw nodes. Custom content renders flush with the message edge; wrap it in a ghost `ChatMessageBubble` to align it with the bubble text column.
- `avatar`: element rendered beside the message, typically `Avatar`. Ignored when `sender` is `system`.
- `name`: replaces the `name` prop.
- `metadata`: rendered below the body. Use it when the last child is raw content, not a bubble; with bubbles, use the bubble's `metadata` slot instead.

## Exposed

- `element`: the root `<article>` element.

---
layout: component-docs
title: Chat Message List
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatMessageList props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>'top' | 'bottom'</code></td><td><code>'bottom'</code></td><td>Vertical alignment when the list is shorter than its container. <code>'bottom'</code> fills the free space with a spacer, so a short conversation sits just above the composer; <code>'top'</code> leaves the spacer out, so messages start at the top. A list that already overflows scrolls the same way in both modes.</td></tr>
<tr><td><code>density</code></td><td><code>ChatDensity</code></td><td><code>'balanced'</code></td><td>Visual density: <code>'compact'</code>, <code>'balanced'</code>, or <code>'spacious'</code>. Flows to child messages through context.</td></tr>
<tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>density value</td><td>Gap between top-level rows, on the spacing scale. Overrides the density gap without changing padding.</td></tr>
<tr><td><code>scrollToTopAction</code></td><td><code>() =&gt; Promise&lt;void&gt;</code></td><td>—</td><td>Runs when a sentinel at the top of the list enters the scroll parent. Use it to load older messages. A spinner stays at the top until the promise settles.</td></tr>
<tr><td><code>isStreaming</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the log <code>aria-busy</code> while an assistant message is still growing, so a screen reader waits and announces the finished message once.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>localized “Messages”</td><td>Accessible name of the log.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: message rows, usually `ChatMessage` and `ChatSystemMessage`.
- `emptyState`: shown when the default slot is omitted.
- `empty`: alias of `emptyState`.

## Exposed

- `element`: the root `<div role="log">` element.

---
layout: component-docs
title: Chat Tokenized Text
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatTokenizedText props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>tokens</code></td><td><code>ChatComposerToken[]</code></td><td>—</td><td>Token definitions using the same type as the composer input. Each non-empty <code>value</code> is matched literally. A structured token renders a <code>Badge</code>, a token with <code>render</code> renders that markup.</td></tr>
<tr><td><code>text</code></td><td><code>string</code></td><td>—</td><td>Same as the default slot: message text that may contain serialized token values. Anything that does not match a token stays as it is. The prop wins when both it and the default slot are set.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the message text. Plain text only, because token content comes from the `tokens` prop. Everything that does not match a token is rendered as-is.

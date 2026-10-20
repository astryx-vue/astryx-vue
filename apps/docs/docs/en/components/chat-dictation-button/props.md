---
layout: component-docs
title: Chat Dictation Button
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatDictationButton props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>dictation</code></td><td><code>{ isSupported, isListening, bands, volume, toggle }</code></td><td>—</td><td>Required. The return value of <code>useChatDictation</code> or <code>useSpeechRecognition</code>. A <code>reactive()</code> copy works: each field is read as it changes.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Button size, forwarded to <code>Button</code>. Also sets the bar width and height.</td></tr>
<tr><td><code>isHiddenWhenUnsupported</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Hide the control when speech recognition is missing. Set it to <code>false</code> to keep the control visible and disabled.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Start dictation” / “Stop dictation”</td><td>Accessible name of the button.</td></tr>
</tbody></table>
</div>

The button paints the accent color while it listens. When the input level goes past the clipping threshold, the bars mix toward the error color, so a loud microphone is visible at a glance.

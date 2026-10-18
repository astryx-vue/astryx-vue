---
layout: component-docs
title: Chat Composer
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatComposer props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>The draft. Bound with <code>v-model</code>, the composer renders exactly that string; left unbound, it keeps the draft itself.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>Localized “Type a message…”</td><td>Text shown while the draft is empty.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Stops editing and sending. A visible stop button stays reachable, so the reader can still cancel a reply.</td></tr>
<tr><td><code>density</code></td><td><code>ChatComposerDensity</code></td><td><code>'balanced'</code></td><td>Spacing inside the body. <code>compact</code>, <code>balanced</code>, or <code>spacious</code>.</td></tr>
<tr><td><code>elevation</code></td><td><code>'none' | 'low'</code></td><td><code>'low'</code></td><td><code>low</code> is raised and deepens on hover and focus. <code>none</code> is flat and draws a border. Keyboard focus in the editor adds the shared focus ring either way; pointer focus does not.</td></tr>
<tr><td><code>isStopShown</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Swaps the send action for stop. Use it while a reply is still streaming in.</td></tr>
<tr><td><code>status</code></td><td><code>ChatComposerStatus</code></td><td>—</td><td>Feedback object, <code>{ type: 'error' | 'warning', message }</code>. The error type is announced as an alert, the warning type as a status.</td></tr>
<tr><td><code>statusPosition</code></td><td><code>'top' | 'bottom'</code></td><td><code>'bottom'</code></td><td>Which side of the body the status sits on.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ChatComposer events" tabindex="0">
<table><thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>submit</code></td><td><code>string</code></td><td>A trimmed, non-empty draft was submitted. The draft is then cleared.</td></tr>
<tr><td><code>stop</code></td><td>—</td><td>The stop action was activated.</td></tr>
<tr><td><code>change</code></td><td><code>string</code></td><td>The draft changed, including the clear after a successful submit.</td></tr>
<tr><td><code>update:modelValue</code></td><td><code>string</code></td><td>The draft the composer is asking for. This is what <code>v-model</code> binds.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ChatComposer slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>drawer</code></td><td>Collapsible content above the body. Usually <code>ChatComposerDrawer</code>.</td></tr>
<tr><td><code>headerActions</code></td><td>Start side of the header. Small icon buttons line up with the row.</td></tr>
<tr><td><code>headerContext</code></td><td>End side of the header. Context such as a usage meter.</td></tr>
<tr><td><code>input</code></td><td>Replaces the default token input. Read the draft from <code>useChatComposerContext</code>.</td></tr>
<tr><td><code>footerActions</code></td><td>Start side of the footer. Medium buttons match the send button.</td></tr>
<tr><td><code>sendActions</code></td><td>Sits just before the send button, for example a dictation or microphone button.</td></tr>
<tr><td><code>sendButton</code></td><td>Replaces the default send and stop button.</td></tr>
</tbody></table>
</div>

## Exposed

<div class="component-api-table" role="region" aria-label="ChatComposer exposed" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>The root frame, for measuring or scrolling.</td></tr>
</tbody></table>
</div>

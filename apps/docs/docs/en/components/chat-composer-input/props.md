---
layout: component-docs
title: Chat Composer Input
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatComposerInput props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>The draft. Inside a <code>ChatComposer</code>, the shell's draft is used when this is omitted.</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>Composer's, then localized “Type a message…”</td><td>Text shown only while the serialized draft is empty.</td></tr>
<tr><td><code>maxRows</code></td><td><code>number</code></td><td><code>8</code></td><td>Lines before the editor scrolls.</td></tr>
<tr><td><code>triggers</code></td><td><code>ChatComposerTrigger[]</code></td><td>—</td><td>Characters that open a suggestion list. Each trigger carries the character, a search source, and what to insert.</td></tr>
<tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Delay before an async trigger search. Synchronous sources are not delayed.</td></tr>
<tr><td><code>hasHistory</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Arrow keys at the ends of the draft recall earlier submissions.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Message input”</td><td>Accessible name of the editor.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>Composer's value</td><td>Stops editing. Falls back to the surrounding composer.</td></tr>
<tr><td><code>pasteAsToken</code></td><td><code>{ onPaste } | false</code></td><td>Built-in threshold</td><td>Long pastes become chips. Pass a <code>useChatPasteAsToken</code> result to change the threshold, or <code>false</code> to insert the text as-is.</td></tr>
<tr><td><code>pasteAction</code></td><td><code>(event, text) =&gt; boolean | void</code></td><td>—</td><td>First chance at a plain-text paste. Return <code>true</code> to keep the input from inserting the text itself.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ChatComposerInput events" tabindex="0">
<table><thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>string</code></td><td>The serialized draft, including chip values. This is what <code>v-model</code> binds.</td></tr>
<tr><td><code>change</code></td><td><code>string</code></td><td>The draft changed, by typing, pasting, or a programmatic insert.</td></tr>
<tr><td><code>submit</code></td><td><code>string</code></td><td>Enter without Shift. Shift+Enter inserts a newline.</td></tr>
<tr><td><code>files</code></td><td><code>File[]</code></td><td>Files from a paste or a drop. A file drop does not navigate away.</td></tr>
<tr><td><code>keydown</code></td><td><code>KeyboardEvent</code></td><td>Keydown after an open trigger menu has declined the event. Call <code>preventDefault()</code> to skip Enter-to-send and history recall.</td></tr>
</tbody></table>
</div>

## Exposed

<div class="component-api-table" role="region" aria-label="ChatComposerInput exposed" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>insertToken</code></td><td><code>(token) =&gt; string | undefined</code></td><td>Inserts a chip at the caret and returns its id.</td></tr>
<tr><td><code>expandToken</code></td><td><code>(id: string) =&gt; void</code></td><td>Replaces a chip with the text it serializes to.</td></tr>
<tr><td><code>insertText</code></td><td><code>(text: string) =&gt; void</code></td><td>Inserts plain text at the caret.</td></tr>
<tr><td><code>focus</code></td><td><code>() =&gt; void</code></td><td>Focuses the editor and keeps a caret the user already had inside it.</td></tr>
<tr><td><code>getValue</code></td><td><code>() =&gt; string</code></td><td>The serialized draft, including chip values.</td></tr>
</tbody></table>
</div>

---
layout: component-docs
title: useChatPasteAsToken
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useChatPasteAsToken parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseChatPasteAsTokenOptions</code></td>
        <td>—</td>
        <td>Configuration object. Required.</td>
      </tr>
      <tr>
        <td><code>options.input</code></td>
        <td><code>Ref&lt;ChatComposerInputHandle | null&gt;</code></td>
        <td>—</td>
        <td>The composer handle. A long paste is inserted with its <code>insertToken</code> method. Required.</td>
      </tr>
      <tr>
        <td><code>options.threshold</code></td>
        <td><code>number</code></td>
        <td><code>200</code></td>
        <td>Pastes longer than this many characters become a token. Shorter pastes stay inline.</td>
      </tr>
      <tr>
        <td><code>options.toToken</code></td>
        <td><code>(text: string) =&gt; ChatComposerToken</code></td>
        <td>Neutral badge</td>
        <td>Builds the token from the pasted text. The default is a neutral badge whose label is the size of the paste, in the active locale.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useChatPasteAsToken return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onPaste</code></td>
        <td><code>(text: string) =&gt; boolean</code></td>
        <td>True means the paste became a token. False means the composer should insert the text.</td>
      </tr>
    </tbody>
  </table>
</div>

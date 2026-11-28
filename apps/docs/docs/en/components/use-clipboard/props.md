---
layout: component-docs
title: useClipboard
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useClipboard parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseClipboardOptions</code></td>
        <td><code>{}</code></td>
        <td>Configuration object. Optional.</td>
      </tr>
      <tr>
        <td><code>options.announce</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Message announced to a polite live region on a successful copy. A swapped <code>aria-label</code> alone is not reliably announced, so pass the localized confirmation (e.g. "Copied") to have it spoken. Omit to skip the announcement.</td>
      </tr>
      <tr>
        <td><code>options.resetAfterMs</code></td>
        <td><code>number</code></td>
        <td><code>2000</code></td>
        <td>Milliseconds <code>isCopied</code> or <code>isFailed</code> stays true after a copy before reverting.</td>
      </tr>
      <tr>
        <td><code>options.announceFailure</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Message announced to the assertive live region when the copy fails, because a failure is an error. Accepts a ref or getter. Omit to skip the announcement.</td>
      </tr>
      <tr>
        <td><code>options.onError</code></td>
        <td><code>(error: unknown) =&gt; void</code></td>
        <td>—</td>
        <td>Called once with the rejection when the clipboard write fails. The error itself is never shown.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useClipboard return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>copy</code></td>
        <td><code>(text: string) =&gt; Promise&lt;boolean&gt;</code></td>
        <td>Writes <code>text</code> to the clipboard. On success flips <code>isCopied</code> to true, announces the configured message, restarts the reset timer, and resolves true. Where the frame refuses the async Clipboard API (a sandboxed viewer or an embed), or the browser refuses the write, the text is copied with the browser copy command inside the reader's click or key press, without moving focus. A failed write flips <code>isFailed</code> to true, announces the failure message, restarts the reset timer, and resolves false.</td>
      </tr>
      <tr>
        <td><code>isFailed</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>True for <code>resetAfterMs</code> after a failed copy. The next copy clears it.</td>
      </tr>
      <tr>
        <td><code>isCopied</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>True for <code>resetAfterMs</code> after the most recent successful copy, then reverts. Drive the copied confirmation (e.g. a copy → check icon flip) off this.</td>
      </tr>
    </tbody>
  </table>
</div>

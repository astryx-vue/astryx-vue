---
layout: component-docs
title: useTypeahead
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useTypeahead Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseTypeaheadOptions</code></td>
        <td>—</td>
        <td>Configuration object.</td>
      </tr>
      <tr>
        <td><code>options.getItemLabels</code></td>
        <td><code>() =&gt; ReadonlyArray&lt;string | null | undefined&gt;</code></td>
        <td>—</td>
        <td>Returns the item labels in DOM order. A null or empty entry marks a non-matchable slot and keeps indices aligned with the caller's items.</td>
      </tr>
      <tr>
        <td><code>options.onMatch</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>—</td>
        <td>Called with the index of the matched item so the caller can focus or select it; typically <code>useListFocus</code>'s <code>focusItem</code>.</td>
      </tr>
      <tr>
        <td><code>options.getCurrentIndex</code></td>
        <td><code>() =&gt; number</code></td>
        <td><code>() =&gt; -1</code></td>
        <td>The index to search from, usually the focused item, so repeated presses of one letter cycle through matches. A negative value means nothing is current.</td>
      </tr>
      <tr>
        <td><code>options.resetMs</code></td>
        <td><code>number</code></td>
        <td><code>750</code></td>
        <td>Milliseconds of inactivity after which the typed buffer resets.</td>
      </tr>
      <tr>
        <td><code>options.isDisabled</code></td>
        <td><code>(index: number) =&gt; boolean</code></td>
        <td>—</td>
        <td>Whether an index should be skipped, e.g. disabled items.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTypeahead Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; boolean</code></td>
        <td>Keydown handler. Returns <code>true</code> when it consumed a printable character, so the caller can stop its own key handling.</td>
      </tr>
      <tr>
        <td><code>reset</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Clears the pending buffer, e.g. when the collection closes.</td>
      </tr>
    </tbody>
  </table>
</div>

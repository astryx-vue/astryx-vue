---
layout: component-docs
title: useAnnounce
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useAnnounce parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.hasReplace</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>This announcer's new message takes back its own previous message while that one has not been spoken yet, whatever the two politenesses. The new one is written to the region of its own politeness. Messages from other announcers still join.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useAnnounce returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>announce</code></td>
        <td><code>(message: string, politeness?: 'polite' | 'assertive') =&gt; void</code></td>
        <td>Speaks a message through the shared live region. Politeness defaults to <code>polite</code>; messages announced in the same frame are joined, in order, into one announcement, and an identical repeat is kept once. An empty message clears any lingering status, including joined messages not yet spoken, instead of announcing.</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useAnnounce
outline: false
footer: false
---

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
        <td>Speaks a message through the shared live region. Politeness defaults to <code>polite</code>; an empty message clears any lingering status instead of announcing.</td>
      </tr>
    </tbody>
  </table>
</div>

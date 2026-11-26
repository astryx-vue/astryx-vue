---
layout: component-docs
title: useLocaleDirection
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useLocaleDirection returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>direction</code></td>
        <td><code>ComputedRef&lt;'ltr' | 'rtl'&gt;</code></td>
        <td>The text direction of the nearest provider: its <code>dir</code>, else derived from its locale. Outside a provider it is derived from the default locale, so it is <code>'ltr'</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

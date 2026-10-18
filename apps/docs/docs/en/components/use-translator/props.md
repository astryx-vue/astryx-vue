---
layout: component-docs
title: useTranslator
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useTranslator returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>t</code></td>
        <td><code>(key: string, values?: Record&lt;string, string | number&gt;) =&gt; string</code></td>
        <td>A translator function bound to the current InternationalizationProvider context. Call it with a message key and optional placeholder values to get the formatted string in the active locale. The function itself stays the same for the life of the component; every call reads the provider, so it is safe to use in render, event handlers, watchers, or any code that runs during the component's lifecycle.</td>
      </tr>
    </tbody>
  </table>
</div>

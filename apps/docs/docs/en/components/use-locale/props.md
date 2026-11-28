---
layout: component-docs
title: useLocale
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useLocale returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>locale</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>The active InternationalizationProvider BCP 47 locale. Falls back to <code>'en'</code> when no provider is present.</td>
      </tr>
      <tr>
        <td><code>calendar</code></td>
        <td><code>ComputedRef&lt;CalendarSystem&gt;</code></td>
        <td>The calendar chosen by the nearest <code>InternationalizationProvider</code>, such as <code>'persian'</code>. Without a provider or a <code>calendar</code> it is <code>'gregory'</code>; an unknown calendar, or one the runtime cannot show, also reads as <code>'gregory'</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

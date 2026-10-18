---
layout: component-docs
title: useCollator
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useCollator parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;Intl.CollatorOptions | undefined&gt;</code></td>
        <td>—</td>
        <td>Optional collation behavior such as numeric ordering, sensitivity, punctuation handling, and case order. Pass a <code>ref</code> or a getter when the options can change; the collator is rebuilt when they do.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useCollator returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>collator</code></td>
        <td><code>ComputedRef&lt;Intl.Collator&gt;</code></td>
        <td>A memoized collator bound to the active <code>InternationalizationProvider</code> locale. Read <code>collator.value</code> to compare.</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useMergedRefs
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useMergedRefs parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>refs</code></td>
        <td><code>readonly MergedRef&lt;T&gt;[]</code></td>
        <td>—</td>
        <td>Up to six refs that should all receive the same element. One entry is a <code>Ref&lt;T | null&gt;</code>, a function ref, <code>null</code>, or <code>undefined</code>; empty slots are skipped. Required.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useMergedRefs returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mergedRef</code></td>
        <td><code>(value: Element | ComponentPublicInstance | null) =&gt; void</code></td>
        <td>A merged callback ref that remains stable for the life of the component. It accepts whatever Vue hands a template ref, including <code>null</code> on unmount, and forwards the value to every entry in <code>refs</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

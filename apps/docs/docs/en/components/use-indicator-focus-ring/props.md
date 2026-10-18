---
layout: component-docs
title: useIndicatorFocusRing
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useIndicatorFocusRing parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>Ref to an element wrapping only the indicator, so its single element child is unambiguously the thing to ring. Required.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean | MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>Skip the ring; a disabled control is not focusable.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useIndicatorFocusRing returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>focusProps</code></td>
        <td><code>{ onFocus: (event: FocusEvent) =&gt; void, onBlur: () => void }</code></td>
        <td>Bind on the element that owns the focusable input: <code>onFocus</code> to <code>@focusin</code>, <code>onBlur</code> to <code>@focusout</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

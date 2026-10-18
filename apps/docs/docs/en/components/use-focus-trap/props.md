---
layout: component-docs
title: useFocusTrap
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useFocusTrap parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseFocusTrapOptions</code></td>
        <td>—</td>
        <td>Configuration object for the focus trap. Required.</td>
      </tr>
      <tr>
        <td><code>options.container</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>The element that traps focus. Bind the same template ref in the template. Required.</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>Whether the trap is active. Turning it on installs the listener and moves focus in; turning it off removes the listener. Required.</td>
      </tr>
      <tr>
        <td><code>options.initialFocus</code></td>
        <td><code>() =&gt; HTMLElement | null</code></td>
        <td>—</td>
        <td>Element to focus when the trap turns on. Return <code>null</code> to fall back to the first focusable element. Optional.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useFocusTrap return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focuses the first focusable element inside the container.</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Focuses the last focusable element inside the container.</td>
      </tr>
      <tr>
        <td><code>update</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Kept for callers that re-measure after the container's children change. It does nothing: the focusable elements are read on each key press.</td>
      </tr>
    </tbody>
  </table>
</div>

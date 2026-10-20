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
        <td><code>{}</code></td>
        <td>Configuration object for the focus trap. Every field inside it is optional.</td>
      </tr>
      <tr>
        <td><code>options.container</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>The element that traps focus. Bind the same template ref in the template. Leave it out and the hook creates its own, returned as <code>containerRef</code>.</td>
      </tr>
      <tr>
        <td><code>options.isActive</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>Whether the focus trap is currently active. Turning it on installs the listeners and moves focus in; turning it off removes them and restores focus. <code>isEnabled</code> is the same switch under its other name; either one being true activates the trap.</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>The same switch as <code>isActive</code>, for callers that read better with it. Pass either name, not both.</td>
      </tr>
      <tr>
        <td><code>options.onEscape</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Callback when Escape is pressed inside the trapped container. The trap does not consume the key: a light-dismiss handler beside it still sees the event.</td>
      </tr>
      <tr>
        <td><code>options.initialFocus</code></td>
        <td><code>() =&gt; HTMLElement | null</code></td>
        <td>—</td>
        <td>Element to focus when the trap turns on. Return <code>null</code> to fall back to the first focusable element.</td>
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
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Ref to attach to the container element that should trap focus. It is the ref you passed as <code>container</code>, or the one the hook made for you.</td>
      </tr>
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

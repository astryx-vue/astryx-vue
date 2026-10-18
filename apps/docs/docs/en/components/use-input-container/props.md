---
layout: component-docs
title: useInputContainer
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useInputContainer parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseInputContainerOptions</code></td>
        <td>—</td>
        <td>Configuration object for the input container. Required.</td>
      </tr>
      <tr>
        <td><code>options.containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>Ref to the outer container/wrapper element. Required.</td>
      </tr>
      <tr>
        <td><code>options.inputRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>Ref to the inner input, textarea, or other focusable control. Required.</td>
      </tr>
      <tr>
        <td><code>options.disabled</code></td>
        <td><code>boolean | MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>Whether the input is disabled. Read again on every event.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useInputContainer returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>Click handler to attach to the container wrapper.</td>
      </tr>
      <tr>
        <td><code>onMouseUp</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>Mouse up handler to attach to the container wrapper.</td>
      </tr>
    </tbody>
  </table>
</div>

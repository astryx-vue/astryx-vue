---
layout: component-docs
title: useClickableContainer
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useClickableContainer parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseClickableContainerOptions</code></td>
        <td>—</td>
        <td>Configuration object for the clickable container. Required.</td>
      </tr>
      <tr>
        <td><code>options.containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>Ref to the outer container element. Required.</td>
      </tr>
      <tr>
        <td><code>options.interactiveRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>Ref to the primary interactive element inside (link, button). If no <code>onClick</code> or <code>href</code> is provided, clicks are proxied to this element.</td>
      </tr>
      <tr>
        <td><code>options.onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>—</td>
        <td>Click handler fired when the container surface (not a nested interactive element) is clicked.</td>
      </tr>
      <tr>
        <td><code>options.href</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Navigation URL. When provided, clicking the container navigates to this URL.</td>
      </tr>
      <tr>
        <td><code>options.target</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Link target (for example <code>'_blank'</code>). Used with <code>href</code> for navigation behavior.</td>
      </tr>
      <tr>
        <td><code>options.disabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the container is disabled.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useClickableContainer returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>Click handler to attach to the container element.</td>
      </tr>
      <tr>
        <td><code>onMouseUp</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>Mouse up handler to attach to the container (handles middle-click navigation for <code>href</code>).</td>
      </tr>
    </tbody>
  </table>
</div>

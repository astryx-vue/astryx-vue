---
layout: component-docs
title: useScrollOverflow
outline: false
footer: false
---

## Parameters

None. The hook reads the element it is bound to.

## Returns

<div class="component-api-table" role="region" aria-label="useScrollOverflow Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>scrollRef</code></td>
        <td><code>(node: HTMLElement | null) =&gt; void</code></td>
        <td>Function ref to attach to the horizontally scrollable container element.</td>
      </tr>
      <tr>
        <td><code>overflowStart</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether content overflows the start edge (left in LTR, right in RTL).</td>
      </tr>
      <tr>
        <td><code>overflowEnd</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether content overflows the end edge (right in LTR, left in RTL).</td>
      </tr>
      <tr>
        <td><code>hasOverflow</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the container has any scroll overflow at all (<code>scrollWidth &gt; clientWidth</code>).</td>
      </tr>
    </tbody>
  </table>
</div>

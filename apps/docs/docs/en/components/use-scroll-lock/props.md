---
layout: component-docs
title: useScrollLock
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useScrollLock Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isLocked</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>Whether body scroll should be locked. Read through a watcher, so pass a ref or a computed, not a plain boolean.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

None. The lock is a side effect on `document.body.style.overflow`, and nothing is rendered.

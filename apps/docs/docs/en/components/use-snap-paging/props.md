---
layout: component-docs
title: useSnapPaging
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useSnapPaging parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;SnapPagingOptions&gt;</code></td>
        <td><code>{}</code></td>
        <td>Paging options, or a ref or getter that returns them. Read at each flick, so a new value applies from the next one.</td>
      </tr>
      <tr>
        <td><code>options.pages</code></td>
        <td><code>'view' | 'item'</code></td>
        <td><code>'view'</code></td>
        <td>What one flick moves. <code>'view'</code> moves one view and lands on the item start edge nearest one viewport on; <code>'item'</code> moves one item.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useSnapPaging return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>paging</code></td>
        <td><code>SnapPaging</code></td>
        <td>Snap paging for Carousel's <code>hasSnap</code>. Carousel attaches it to its scroll area on mount and keeps the value it first attached; switching back to <code>true</code> or <code>false</code> detaches it.</td>
      </tr>
    </tbody>
  </table>
</div>

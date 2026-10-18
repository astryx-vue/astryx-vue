---
layout: component-docs
title: useTableStickyColumns
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter or a ref to change the pinned keys at runtime.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableStickyColumns parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>startKeys</code></td>
        <td><code>readonly string[]</code></td>
        <td>—</td>
        <td>Column keys pinned to the start (inline-start / left in LTR) edge: the contiguous run from the first column through the last listed key.</td>
      </tr>
      <tr>
        <td><code>endKeys</code></td>
        <td><code>readonly string[]</code></td>
        <td>—</td>
        <td>Column keys pinned to the end (inline-end / right in LTR) edge: the contiguous run from the first listed key through the last column.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableStickyColumns returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>cellPatch</code></td>
        <td><code>(input: TableCellPatchInput&lt;T&gt;) =&gt; TableCellPatch | null</code></td>
        <td>Marks a header or body cell as sticky. The offset is cumulative over the pinned run: each pinned column adds the floor width of the one before it. Returns <code>null</code> for columns that stay in flow, and for every column while both key lists are empty.</td>
      </tr>
      <tr>
        <td><code>bindScrollRoot</code></td>
        <td><code>(element: HTMLElement | null) =&gt; void</code></td>
        <td>The table calls this with its scroll container, and again with <code>null</code> when it unmounts. The hook listens to scroll and resize there and writes <code>--table-sticky-shadow-start</code> / <code>--table-sticky-shadow-end</code> as <code>'1'</code> or <code>'0'</code>, which drive the soft shadow. The listener is removed when the scope is disposed.</td>
      </tr>
    </tbody>
  </table>
</div>

A pinned cell gets `position: sticky`, an inset on the start or end edge, `z-index` 3 for a header cell and 1 for a body cell, and the classes `astryx-table__sticky` plus `astryx-table__sticky--start` or `astryx-table__sticky--end`.

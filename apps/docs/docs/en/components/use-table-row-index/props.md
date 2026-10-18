---
layout: component-docs
title: useTableRowIndex
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter or a ref to keep the plugin on the current values.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableRowIndex parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>readonly T[]</code></td>
        <td>—</td>
        <td>The data array currently rendered by the table (post sort/filter/page). Numbering follows this order.</td>
      </tr>
      <tr>
        <td><code>getRowKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>Optional key extractor returning a unique string per row. When provided, index lookup is keyed by the returned string; otherwise items are matched by reference identity. A plain function in a getter is already stable, so there is nothing to memoize.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'#'</code></td>
        <td>Header label for the index column.</td>
      </tr>
      <tr>
        <td><code>startFrom</code></td>
        <td><code>number</code></td>
        <td><code>1</code></td>
        <td>First index value.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableRowIndex returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>Prepends the row-number column. Its key is <code>__rowIndex</code>, its width is <code>pixel(48)</code>, it aligns to the end and it is not resizable. Group header rows get an empty cell. The number sits in a <code>span.astryx-table__row-index</code>, which is monospaced and right-aligned.</td>
      </tr>
    </tbody>
  </table>
</div>

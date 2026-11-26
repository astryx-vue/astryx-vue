---
layout: component-docs
title: useTableSortableState
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useTableSortableState parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td>
        <td>required</td>
        <td>The rows to sort. Pass a ref or a getter when they change.</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly TableColumn&lt;T&gt;[]&gt;</code></td>
        <td><code>[]</code></td>
        <td>The table columns. A column's <code>sortable.sortKey</code> and <code>sortable.compare</code> decide how its key sorts.</td>
      </tr>
      <tr>
        <td><code>defaultSort</code></td>
        <td><code>MaybeRefOrGetter&lt;TableSortState&gt;</code></td>
        <td><code>[]</code></td>
        <td>The sort the table starts with, read once.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableSortableState return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sortedData</code></td>
        <td><code>ComputedRef&lt;T[]&gt;</code></td>
        <td>A sorted copy of <code>data</code>. With no sort, the rows keep their order.</td>
      </tr>
      <tr>
        <td><code>sort</code></td>
        <td><code>Ref&lt;TableSortState&gt;</code></td>
        <td>The current sort: <code>{ sortKey, direction }</code> entries in priority order. Assign to it to change the sort from code.</td>
      </tr>
      <tr>
        <td><code>sortConfig</code></td>
        <td><code>UseTableSortableConfig</code></td>
        <td>The config for <code>useTableSortable</code>: <code>sort</code> reads the current state, and <code>onSortChange</code> writes it.</td>
      </tr>
    </tbody>
  </table>
</div>

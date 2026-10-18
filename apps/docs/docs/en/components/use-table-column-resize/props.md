---
layout: component-docs
title: useTableColumnResize
outline: false
footer: false
---

## Parameters

`useTableColumnResize()` takes one config object. Wrap it in a getter or a `ref` so the table reads the current widths: `useTableColumnResize(() => ({ ... }))`.

<div class="component-api-table" role="region" aria-label="useTableColumnResize parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columnWidths</code></td>
        <td><code>Record&lt;string, number&gt;</code></td>
        <td>—</td>
        <td>Required. Controlled pixel-width overrides keyed by column key. When a key is present it overrides the column's declared width.</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(updates: Record&lt;string, number&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>Required. Called when a resize completes. Receives a map of every column key whose width changed; merge it into your <code>columnWidths</code> state.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTableColumnResize()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills two fields of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTableColumnResize returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>widthFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; number | undefined</code></td>
        <td>Returns the override for one column, or <code>undefined</code> when the column has none.</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(key: string, width: number) =&gt; void</code></td>
        <td>Called by <code>Table</code> with the committed width. It rounds the width, keeps it at 60px or more, and passes it on to your <code>onColumnResizeEnd</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

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
        <td><code>{}</code></td>
        <td>Controlled pixel-width overrides keyed by column key. When a key is present it overrides the column's declared width.</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(updates: Record&lt;string, number&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>Called when a resize completes (pointer release or a key press). Receives a map of every column key whose width changed; merge it into your <code>columnWidths</code> state. The last column is left out because its width follows the space that is left.</td>
      </tr>
      <tr>
        <td><code>minWidth</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Global minimum column width in pixels during a resize. Overrides the per-column floors.</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number</code></td>
        <td><code>Infinity</code></td>
        <td>Global maximum column width in pixels during a resize.</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>readonly TableColumn&lt;T&gt;[]</code></td>
        <td>—</td>
        <td>Column definitions, used to derive per-column minimums and to tell proportional columns from pixel ones when picking the neighbour and the last column. <code>Table</code> passes its own columns, so you only need this when you call the helper functions yourself.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTableColumnResize()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills three fields of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTableColumnResize returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>widthFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; number | undefined</code></td>
        <td>Returns the committed override for one column, or <code>undefined</code> when the column has none.</td>
      </tr>
      <tr>
        <td><code>resizeFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;, columns: readonly TableColumn&lt;T&gt;[]) =&gt; TableColumnResizeContribution | null</code></td>
        <td>Describes how one column takes part in a resize: its current width, its minimum and maximum, the neighbour that gives up width, and whether the column gets a handle.</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(updates: Record&lt;string, number&gt;) =&gt; void</code></td>
        <td>Called by <code>Table</code> with every changed column. It rounds each width to whole pixels and passes the map on to your <code>onColumnResizeEnd</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Helpers

The same module exports the pieces the plugin is built from, so you can reuse the arithmetic in your own UI.

<div class="component-api-table" role="region" aria-label="useTableColumnResize helpers" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columnResizeMinWidth</code></td>
        <td><code>(width: ColumnWidth | undefined, globalMinWidth?: number) =&gt; number</code></td>
        <td>The narrowest a column may get: the global minimum when set, otherwise the column's own floor.</td>
      </tr>
      <tr>
        <td><code>isProportionalColumnWidth</code></td>
        <td><code>(width: ColumnWidth | undefined) =&gt; boolean</code></td>
        <td>True for a proportional column and for a column with no declared width.</td>
      </tr>
      <tr>
        <td><code>resizeColumnWidths</code></td>
        <td><code>(plan: ColumnResizePlan, delta: number) =&gt; number[]</code></td>
        <td>Applies a pointer movement in pixels to a set of column snapshots and returns every resulting width.</td>
      </tr>
      <tr>
        <td><code>columnResizeStep</code></td>
        <td><code>(isShiftKey: boolean) =&gt; number</code></td>
        <td>How far one arrow key press moves a handle: 10px, or 50px with Shift.</td>
      </tr>
      <tr>
        <td><code>columnResizeDirectionSign</code></td>
        <td><code>(direction: string) =&gt; 1 | -1</code></td>
        <td>The sign a horizontal movement gets in the current writing direction. RTL returns <code>-1</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useTablePagination
outline: false
footer: false
---

## Parameters

`useTablePagination()` takes one config object. Wrap it in a getter or a `ref` so the controls read the current page: `useTablePagination(() => ({ ... }))`.

<div class="component-api-table" role="region" aria-label="useTablePagination parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>page</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Required. Current page number, 1-based.</td>
      </tr>
      <tr>
        <td><code>onPageChange</code></td>
        <td><code>(page: number) =&gt; void</code></td>
        <td>—</td>
        <td>Required. Called when the page changes.</td>
      </tr>
      <tr>
        <td><code>totalItems</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>Total number of items across all pages. Used to calculate total page count. Without it the controls see zero items.</td>
      </tr>
      <tr>
        <td><code>pageSize</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>Number of items per page. Slice the rows with the same number.</td>
      </tr>
      <tr>
        <td><code>onPageSizeChange</code></td>
        <td><code>(pageSize: number) =&gt; void</code></td>
        <td>—</td>
        <td>Called when the user changes the page size. A page size selector appears only when this and <code>pageSizeOptions</code> are both set.</td>
      </tr>
      <tr>
        <td><code>pageSizeOptions</code></td>
        <td><code>number[]</code></td>
        <td><code>[10, 20, 50, 100]</code></td>
        <td>Available page size options. The selector still needs <code>onPageSizeChange</code> to be shown.</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>'below' | 'above' | 'both' | 'none'</code></td>
        <td><code>'below'</code></td>
        <td>Where the controls render. A plugin can only fill the area under the table, so <code>'below'</code> and <code>'both'</code> render there; <code>'above'</code> and <code>'none'</code> render nothing.</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'center'</code></td>
        <td>Horizontal alignment of the controls.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Accessible name for the pagination nav landmark. When omitted, the pagination uses its own localized name.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTablePagination()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills one field of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTablePagination returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>below</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td>Renders the <code>Pagination</code> controls under the table, or <code>null</code> when <code>position</code> keeps them out.</td>
      </tr>
    </tbody>
  </table>
</div>

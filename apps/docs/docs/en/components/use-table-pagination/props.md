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
        <td>—</td>
        <td>Total number of items across all pages, used to calculate the page count. Without it, and without <code>totalPages</code>, the controls only know about <code>hasMore</code>.</td>
      </tr>
      <tr>
        <td><code>totalPages</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Total number of pages. Use it when you know the page count but not the item count. It wins over the count derived from <code>totalItems</code>.</td>
      </tr>
      <tr>
        <td><code>hasMore</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>Whether more pages exist after the current one. Use it for cursor-based data where the total is unknown; the next button stays enabled while it is true.</td>
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
        <td><code>variant</code></td>
        <td><code>'pages' | 'count' | 'compact' | 'dots' | 'none'</code></td>
        <td><code>'pages'</code></td>
        <td>What the controls show between the previous and next buttons: page number buttons, a "X-Y of Z" count, a compact "page X of Y", dot indicators, or nothing.</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>'below' | 'above' | 'both' | 'none'</code></td>
        <td><code>'below'</code></td>
        <td>Where the controls render relative to the table. With <code>'both'</code> there are two sets, one on each side.</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'center'</code></td>
        <td>Horizontal alignment of the controls.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md'</code></td>
        <td><code>'md'</code></td>
        <td>Height of the controls.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized "Table pagination"</td>
        <td>Accessible name for the pagination nav landmark. With <code>position: 'both'</code> the two navs get distinct names, the label suffixed with "(top)" and "(bottom)", so same-type landmarks stay unique.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTablePagination()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills two fields of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTablePagination returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>above</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td>Renders the controls above the table for <code>position: 'above'</code> and <code>'both'</code>.</td>
      </tr>
      <tr>
        <td><code>below</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td>Renders the controls under the table for <code>position: 'below'</code> and <code>'both'</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

Both return <code>null</code> when <code>position</code> is <code>'none'</code>, or when the table holds a single page and <code>hasMore</code> is not <code>true</code>.

---
layout: component-docs
title: Pagination
outline: false
footer: false
---

## Pagination Props

<div class="component-api-table" role="region" aria-label="Pagination Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>page</code></td><td><code>number</code></td><td><code>1</code></td><td>Current page, starting at 1.</td></tr>
      <tr><td><code>pageSize</code></td><td><code>number</code></td><td><code>10</code></td><td>Items per page.</td></tr>
      <tr><td><code>total</code></td><td><code>number</code></td><td><code>0</code></td><td>Total number of items.</td></tr>
      <tr><td><code>totalItems</code></td><td><code>number</code></td><td>—</td><td>Total number of items, the original name for <code>total</code>. Wins over <code>total</code> and <code>totalPages</code> when both are set.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td><code>Pagination</code> / <code>分页</code></td><td>Accessible name of the navigation landmark.</td></tr>
      <tr><td><code>showSizeChanger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the page-size selector.</td></tr>
      <tr><td><code>pageSizeOptions</code></td><td><code>number[]</code></td><td><code>[10, 20, 50, 100]</code></td><td>Page-size choices.</td></tr>
      <tr><td><code>showTotal</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the total count.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the control.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Older name of <code>isDisabled</code>. Either one disables the control.</td></tr>
      <tr><td><code>prevLabel</code></td><td><code>string</code></td><td><code>Previous</code> / <code>上一页</code></td><td>Previous-page label. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>nextLabel</code></td><td><code>string</code></td><td><code>Next</code> / <code>下一页</code></td><td>Next-page label. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>pageSizeLabel</code></td><td><code>string</code></td><td><code>Per page</code> / <code>每页</code></td><td>Label for the page-size selector. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>variant</code></td><td><code>'pages' | 'count' | 'compact' | 'dots' | 'input' | 'none'</code></td><td><code>'pages'</code></td><td>Middle of the control. <code>input</code> is an editable page field.</td></tr>
      <tr><td><code>siblingCount</code></td><td><code>number</code></td><td><code>1</code></td><td>How many page buttons sit on each side of the current page. Narrow containers drop another step.</td></tr>
      <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>How many pages previous and next move.</td></tr>
      <tr><td><code>hasMore</code></td><td><code>boolean</code></td><td>—</td><td>Whether another page exists when the total is unknown. A <code>total</code> above 0 wins.</td></tr>
      <tr><td><code>pageLabel</code></td><td><code>string</code></td><td><code>Page</code> / <code>页</code></td><td>Noun in front of the <code>input</code> field.</td></tr>
      <tr><td><code>hasFirstLast</code></td><td><code>boolean</code></td><td><code>input</code> when the page count is known</td><td>Shows buttons that jump to the first and last page.</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(page: number) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after the page is committed. The control stays busy until it settles, and a failure does not roll the page back.</td></tr>
    </tbody>
  </table>
</div>

## Pagination events

<div class="component-api-table" role="region" aria-label="Pagination events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:page</code></td><td><code>page: number</code></td><td>Emitted when the page changes.</td></tr>
      <tr><td><code>update:pageSize</code></td><td><code>pageSize: number</code></td><td>Emitted when the page size changes.</td></tr>
      <tr><td><code>pageSizeChange</code></td><td><code>pageSize: number</code></td><td>Emitted when the page size changes, before the page returns to the first one.</td></tr>
      <tr><td><code>change</code></td><td><code>page: number, pageSize: number</code></td><td>Emitted when the page or page size changes.</td></tr>
    </tbody>
  </table>
</div>

## Pagination slots

<div class="component-api-table" role="region" aria-label="Pagination slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Props</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>total</code></td><td><code>{ total, from, to }</code></td><td>Custom total label.</td></tr>
    </tbody>
  </table>
</div>

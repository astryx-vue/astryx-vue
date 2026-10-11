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
      <tr><td><code>showSizeChanger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the page-size selector.</td></tr>
      <tr><td><code>pageSizeOptions</code></td><td><code>number[]</code></td><td><code>[10, 20, 50, 100]</code></td><td>Page-size choices.</td></tr>
      <tr><td><code>showTotal</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the total count.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the control.</td></tr>
      <tr><td><code>prevLabel</code></td><td><code>string</code></td><td>—</td><td>Previous-page label.</td></tr>
      <tr><td><code>nextLabel</code></td><td><code>string</code></td><td>—</td><td>Next-page label.</td></tr>
      <tr><td><code>pageSizeLabel</code></td><td><code>string</code></td><td><code>'每页'</code></td><td>Label for the page-size selector.</td></tr>
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

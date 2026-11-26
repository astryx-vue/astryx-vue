---
layout: component-docs
title: useTableRowsVirtualization
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`. Pass a getter or a ref so the plugin always reads the latest values.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableRowsVirtualization parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>rowHeight</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Full height of a row in CSS pixels, padding and divider included. Rows never get shorter. When every mounted row grows together, windowing continues with the measured height.</td>
      </tr>
      <tr>
        <td><code>initialViewportHeight</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Viewport height in CSS pixels used to plan the first frame (server rendering, before the viewport is measured). It does not set the table's height.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableRowsVirtualization returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>rowModel</code></td>
        <td><code>'flat'</code></td>
        <td>Declares that the plugin only handles flat rows.</td>
      </tr>
      <tr>
        <td><code>virtualization</code></td>
        <td><code>TableVirtualizationContribution</code></td>
        <td>Hands the row height and initial viewport height to the table, which decides which rows to mount and renders every row when a condition is not met.</td>
      </tr>
    </tbody>
  </table>
</div>

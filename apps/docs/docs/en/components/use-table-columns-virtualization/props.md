---
layout: component-docs
title: useTableColumnsVirtualization
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`. Pass a getter or a ref so the plugin always reads the latest value.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableColumnsVirtualization parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>initialViewportWidth</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Viewport width in CSS pixels used to plan the first frame (server rendering, before the scroll region is measured). It does not set the table's width.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableColumnsVirtualization returns" tabindex="0">
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
        <td>Hands the initial viewport width to the table, which decides which columns to mount and renders every column when a condition is not met.</td>
      </tr>
    </tbody>
  </table>
</div>

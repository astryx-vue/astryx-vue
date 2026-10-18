---
layout: component-docs
title: useTableFilterState
outline: false
footer: false
---

## Parameters

`useTableFilterState()` takes one optional argument.

<div class="component-api-table" role="region" aria-label="useTableFilterState parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>initial</code></td>
        <td><code>TableFilterState</code></td>
        <td><code>{}</code></td>
        <td>Optional initial filter state map. It is shallow copied, so the object you pass is never written to.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableFilterState returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filters</code></td>
        <td><code>Ref&lt;TableFilterState&gt;</code></td>
        <td>The live filter map. Read <code>filters.value</code> for the current state.</td>
      </tr>
      <tr>
        <td><code>onFilterChange</code></td>
        <td><code>(key: string, value: TableFilterValue | null) =&gt; void</code></td>
        <td>Sets or clears one field. The map is replaced with a new object, so a getter over it stays in sync.</td>
      </tr>
      <tr>
        <td><code>clearAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Empties the map. Every filter turns off at once.</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterState

<div class="component-api-table" role="region" aria-label="TableFilterState fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>[fieldKey]</code></td>
        <td><code>TableFilterValue</code></td>
        <td>Field key to filter value. <code>TableFilterValue</code> is <code>string | string[]</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

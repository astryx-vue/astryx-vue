---
layout: component-docs
title: useTableFiltering
outline: false
footer: false
---

## Parameters

`useTableFiltering()` takes one config object. Wrap it in a getter or a `ref` so the table reads the current filters: `useTableFiltering(() => ({ ... }))`.

<div class="component-api-table" role="region" aria-label="useTableFiltering parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filters</code></td>
        <td><code>TableFilterState</code></td>
        <td>—</td>
        <td>Required. Current filter state: a map from field key to filter value.</td>
      </tr>
      <tr>
        <td><code>onFilterChange</code></td>
        <td><code>(key: string, value: TableFilterValue | null) =&gt; void</code></td>
        <td>—</td>
        <td>Required. Called when the user changes a filter value. <code>null</code> clears the filter.</td>
      </tr>
      <tr>
        <td><code>fields</code></td>
        <td><code>readonly TableFilterField[]</code></td>
        <td>—</td>
        <td>Required. The fields a column may filter on. Each entry has <code>key</code>, <code>label</code>, <code>type</code>, and optional <code>options</code>.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'popover'</code></td>
        <td><code>'popover'</code></td>
        <td>Display variant for the filter controls.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTableFiltering()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills one field of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTableFiltering returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filterFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableFilterContribution | null</code></td>
        <td>Builds the control for a column, or <code>null</code> when the column has no <code>filter</code> or names a field that is not in <code>fields</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterContribution

<div class="component-api-table" role="region" aria-label="TableFilterContribution fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'popover'</code></td>
        <td>The resolved variant, after the default is applied.</td>
      </tr>
      <tr>
        <td><code>field</code></td>
        <td><code>TableFilterField</code></td>
        <td>The field the column named, taken from <code>fields</code>.</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>TableFilterValue | null</code></td>
        <td>The current value from <code>filters</code>, or <code>null</code> when the field has no filter.</td>
      </tr>
      <tr>
        <td><code>onChange</code></td>
        <td><code>(value: TableFilterValue | null) =&gt; void</code></td>
        <td>Reports a new value through your <code>onFilterChange</code>, already keyed by the field.</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterField

<div class="component-api-table" role="region" aria-label="TableFilterField fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>key</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Field key. A column's <code>filter</code> holds this string, and the field reads <code>row[key]</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Label and placeholder of the control. It also names the control for screen readers.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'string' | 'enum'</code></td>
        <td>—</td>
        <td><code>string</code> matches a substring. <code>enum</code> matches one option exactly.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>readonly { value: string, label: string }[]</code></td>
        <td>—</td>
        <td>Choices for an <code>enum</code> field. An <code>enum</code> field without options renders an empty select.</td>
      </tr>
    </tbody>
  </table>
</div>

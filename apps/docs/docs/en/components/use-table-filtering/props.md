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
        <td>Required. The fields a column may filter on. Each entry has <code>key</code>, <code>label</code>, <code>type</code>, and the options or limits that type needs.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'inline-compact' | 'popover'</code></td>
        <td><code>'popover'</code></td>
        <td>Where the control sits. <code>inline</code> and <code>inline-compact</code> render it in the header cell under the label, <code>inline-compact</code> in a tighter frame; <code>popover</code> keeps it behind a funnel button that applies on confirm.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTableFiltering()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills two fields of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTableFiltering returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>Only set for the inline variants: a filtered column without a <code>width</code> gets <code>proportional(1)</code> so the control fits under the label.</td>
      </tr>
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
        <td><code>'inline' | 'inline-compact' | 'popover'</code></td>
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
        <td><code>'string' | 'enum' | 'multi-select' | 'number' | 'date'</code></td>
        <td>—</td>
        <td>How the filter matches. <code>string</code> matches a substring, <code>enum</code> one option, <code>multi-select</code> any of the picked options, <code>number</code> the same number, and <code>date</code> a cell date later than the picked day.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>readonly { value: string, label: string }[]</code></td>
        <td>—</td>
        <td>Choices for an <code>enum</code> or <code>multi-select</code> field. Without options the control renders an empty list.</td>
      </tr>
      <tr>
        <td><code>min</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Smallest value a <code>number</code> field accepts.</td>
      </tr>
      <tr>
        <td><code>max</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Largest value a <code>number</code> field accepts.</td>
      </tr>
      <tr>
        <td><code>step</code></td>
        <td><code>number</code></td>
        <td><code>1</code> when <code>isIntegerOnly</code>, otherwise none</td>
        <td>Step of a <code>number</code> field.</td>
      </tr>
      <tr>
        <td><code>isIntegerOnly</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>A <code>number</code> field that only accepts whole numbers.</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterValue

<div class="component-api-table" role="region" aria-label="TableFilterValue fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string | number | string[]</code></td>
        <td>A <code>number</code> field stores a number, <code>multi-select</code> stores an array of option values, and the rest store a string. A <code>date</code> field stores an ISO calendar day such as <code>2026-03-21</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

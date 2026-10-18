---
layout: component-docs
title: useTableGroupedRows
outline: false
footer: false
---

## Parameters

`useTableGroupedRows()` takes one config object. Wrap it in a getter or a `ref` so the sections follow the current rows and the current collapsed set: `useTableGroupedRows(() => ({ ... }))`.

<div class="component-api-table" role="region" aria-label="useTableGroupedRows parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>readonly T[]</code></td>
        <td>—</td>
        <td>Required. The flat data to group.</td>
      </tr>
      <tr>
        <td><code>groupBy</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>Required. Derive the group key for a row. Rows with the same key share a section.</td>
      </tr>
      <tr>
        <td><code>collapsedGroups</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>—</td>
        <td>Required. Set of currently-collapsed group keys.</td>
      </tr>
      <tr>
        <td><code>onToggleGroup</code></td>
        <td><code>(groupKey: string) =&gt; void</code></td>
        <td>—</td>
        <td>Required. Called with a group key when its header is toggled.</td>
      </tr>
      <tr>
        <td><code>renderGroupHeader</code></td>
        <td><code>(groupKey: string, count: number, collapsed: boolean) =&gt; VNodeChild</code></td>
        <td>—</td>
        <td>Custom renderer for a group header's content, right of the chevron. Defaults to <code>groupKey (count)</code>.</td>
      </tr>
      <tr>
        <td><code>getRowKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>Stable key for a real row. Falls back to a positional key when omitted.</td>
      </tr>
      <tr>
        <td><code>groupOrder</code></td>
        <td><code>readonly string[]</code></td>
        <td>—</td>
        <td>Explicit group ordering. Groups not listed keep first-seen order after these.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableGroupedRows returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>ComputedRef&lt;T[]&gt;</code></td>
        <td>The rows plus one section header per group, in display order. A collapsed group keeps its header and drops its rows.</td>
      </tr>
      <tr>
        <td><code>plugin</code></td>
        <td><code>TablePlugin&lt;T&gt;</code></td>
        <td>Makes a section header span the row, skips it for selection and row numbers, and toggles it on click.</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>Row identity for both kinds of row: a section header answers with its group key, a data row with <code>getRowKey</code> or its position.</td>
      </tr>
    </tbody>
  </table>
</div>

### isTableGroupHeader

`isTableGroupHeader(item)` narrows an item of `data` to a section header and gives you `groupKey` and `count` without a cast. It is the same check the plugin uses.

## Section header fields

<div class="component-api-table" role="region" aria-label="Table section header fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>groupKey</code></td>
        <td><code>string</code></td>
        <td>The key the section was grouped by.</td>
      </tr>
      <tr>
        <td><code>count</code></td>
        <td><code>number</code></td>
        <td>How many rows the group holds, whether or not it is open.</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>Stable id of the section header, built from the group key.</td>
      </tr>
    </tbody>
  </table>
</div>

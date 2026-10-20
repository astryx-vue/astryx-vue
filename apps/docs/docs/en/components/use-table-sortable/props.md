---
layout: component-docs
title: useTableSortable
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter or a ref to keep the plugin on the current sort state.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableSortable parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sort</code></td>
        <td><code>TableSortState&lt;TSortKey&gt;</code></td>
        <td>—</td>
        <td>Current sort state: an ordered array of <code>{ sortKey, direction }</code>. The first entry is the primary sort, the rest are tiebreakers. An empty array means unsorted. Direction is the full word: <code>'ascending'</code> / <code>'descending'</code>, not <code>'asc'</code> / <code>'desc'</code>.</td>
      </tr>
      <tr>
        <td><code>onSortChange</code></td>
        <td><code>(sort: TableSortState&lt;TSortKey&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>Called when the user clicks a header cell to change sort. Receives the next sort state.</td>
      </tr>
      <tr>
        <td><code>allowUnsortedState</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Allow cycling back to unsorted. When true: 'ascending', 'descending', unsorted. When false: 'ascending', 'descending', 'ascending'.</td>
      </tr>
      <tr>
        <td><code>isMultiSortEnabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Enable multi-sort via Shift+click. Regular click still replaces the entire sort state.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableSortable returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sortFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableSortContribution | null</code></td>
        <td>Returns the sort contribution for a header cell, or <code>null</code> when the column is not sortable. A column is sortable when it declares <code>sortable: true</code> or <code>sortable: { sortKey }</code>.</td>
      </tr>
      <tr>
        <td><code>sortFor().direction</code></td>
        <td><code>'ascending' | 'descending' | null</code></td>
        <td>The direction this column is currently sorted by, or <code>null</code>.</td>
      </tr>
      <tr>
        <td><code>sortFor().rank</code></td>
        <td><code>number | null</code></td>
        <td>1-based position in a multi-sort, shown beside the arrow. <code>null</code> unless more than one entry is sorted.</td>
      </tr>
      <tr>
        <td><code>sortFor().label</code></td>
        <td><code>string</code></td>
        <td>The localized accessible name for the header button, such as "Sort by Name. Sort descending".</td>
      </tr>
      <tr>
        <td><code>sortFor().onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>The click handler. A plain click replaces the whole sort state; Shift+click adds, retargets, or removes this column. Read Shift from the event.</td>
      </tr>
    </tbody>
  </table>
</div>

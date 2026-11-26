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
        <td><code>sortFor().description</code></td>
        <td><code>string | null</code></td>
        <td>The localized description of the header button while several columns are sorted, such as "Priority 2 of 3"; <code>null</code> otherwise. The button is named by its column's text, and the header's <code>aria-sort</code> carries the direction.</td>
      </tr>
      <tr>
        <td><code>sortFor().onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>The click handler. A plain click replaces the whole sort state; Shift+click adds, retargets, or removes this column. Read Shift from the event.</td>
      </tr>
    </tbody>
  </table>
</div>

## useTableSortableState

Holds the sort state and returns the sorted rows. Pass `sortConfig` to `useTableSortable` and `sortedData` to the table. `data`, `columns` and `defaultSort` take a value, a ref or a getter.

<div class="component-api-table" role="region" aria-label="useTableSortableState parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>data</code></td><td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td><td>—</td><td>The rows to sort.</td></tr>
      <tr><td><code>columns</code></td><td><code>MaybeRefOrGetter&lt;readonly TableColumn&lt;T&gt;[]&gt;</code></td><td>—</td><td>The table's columns. A column whose <code>sortable</code> carries a <code>compare</code> sorts its key with that comparator.</td></tr>
      <tr><td><code>defaultSort</code></td><td><code>MaybeRefOrGetter&lt;TableSortState&gt;</code></td><td><code>[]</code></td><td>The sort on the first render. In multi-sort order: the first entry is the primary sort.</td></tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="useTableSortableState returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>sortedData</code></td><td><code>ComputedRef&lt;T[]&gt;</code></td><td>A sorted copy of <code>data</code>. It sorts again only when the data, the sort or the locale changes.</td></tr>
      <tr><td><code>sort</code></td><td><code>Ref&lt;TableSortState&gt;</code></td><td>The current sort. Write it to sort from code.</td></tr>
      <tr><td><code>sortConfig</code></td><td><code>UseTableSortableConfig</code></td><td>Pass it to <code>useTableSortable</code>.</td></tr>
    </tbody>
  </table>
</div>

A comparator (`sortable: { compare }`) sorts ascending; the hook flips it for descending. Keys without one compare numbers numerically and other values as text with a numeric collator in the active locale. A `Date` sorts by its time. `null`, `undefined`, `NaN` and an Invalid Date are missing values: they sort last in ascending order and first in descending. Arrays and plain objects have no sort text, so they compare as equal to each other and sort before text in ascending order: give a key such as `tags` a comparator. A status rank needs one too:

```ts
const statusRank = { blocked: 0, active: 1, done: 2 }
const columns: TableColumn<Task>[] = [
  { key: 'title', header: 'Title' },
  { key: 'status', header: 'Status', sortable: { compare: (a, b) => statusRank[a.status] - statusRank[b.status] } },
  { key: 'tags', header: 'Tags', sortable: { compare: (a, b) => a.tags.join(', ').localeCompare(b.tags.join(', ')) }, renderCell: task => task.tags.join(', ') },
]
const { sortedData, sortConfig } = useTableSortableState<Task>({
  data: tasks,
  columns,
  defaultSort: [{ sortKey: 'status', direction: 'ascending' }, { sortKey: 'title', direction: 'ascending' }],
})
const sortPlugin = useTableSortable<Task>(() => ({ ...sortConfig, isMultiSortEnabled: true }))
```

With `isMultiSortEnabled`, Shift-click adds a column to the sort and each sorted header shows its position.

---
layout: component-docs
title: useTableSelection
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter or a ref to keep the plugin on the current values.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableSelection parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getIsItemSelected</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td>—</td>
        <td>Returns whether the given item is currently selected.</td>
      </tr>
      <tr>
        <td><code>onSelectItem</code></td>
        <td><code>(event: { item: T; isSelected: boolean }) =&gt; void</code></td>
        <td>—</td>
        <td>Called when a row checkbox is toggled. <code>isSelected</code> is the new desired state.</td>
      </tr>
      <tr>
        <td><code>onSelectAll</code></td>
        <td><code>(event: { isAllSelected: boolean }) =&gt; void</code></td>
        <td>—</td>
        <td>Called when the select-all header checkbox is toggled.</td>
      </tr>
      <tr>
        <td><code>getIsAllSelected</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>—</td>
        <td>Returns whether all selectable items are currently selected.</td>
      </tr>
      <tr>
        <td><code>getIsIndeterminate</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td><code>() =&gt; false</code></td>
        <td>Returns whether selection is partial (some but not all). Renders the select-all checkbox in indeterminate state.</td>
      </tr>
      <tr>
        <td><code>getIsItemSelectable</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td><code>() =&gt; true</code></td>
        <td>Returns whether a row should show a checkbox. Non-selectable rows render nothing in the selection cell.</td>
      </tr>
      <tr>
        <td><code>getRowLabel</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>Derives a human-readable identity for a row; the row checkbox's hidden label becomes <code>Select ${getRowLabel(item)}</code> so screen readers announce which row each checkbox selects. Falls back to "Select row" when omitted.</td>
      </tr>
      <tr>
        <td><code>hasRowHighlight</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Paints checked rows with the accent wash. Set false when the surrounding UI already uses row background to mean something else (a row open in a detail panel, say). The wash is an inline style, so it cannot be overridden from userland. Only the background is dropped: <code>aria-selected</code> is still set on checked rows either way.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableSelection returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>selection</code></td>
        <td><code>TableSelectionContribution&lt;T&gt;</code></td>
        <td>The plugin contribution the table reads. Put the whole plugin under any key of the <code>plugins</code> prop; the table picks up the one entry that has <code>selection</code>.</td>
      </tr>
      <tr>
        <td><code>selection.isAllSelected</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>Wraps <code>getIsAllSelected</code>.</td>
      </tr>
      <tr>
        <td><code>selection.isIndeterminate</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>Wraps <code>getIsIndeterminate</code>, or <code>false</code> when it is omitted.</td>
      </tr>
      <tr>
        <td><code>selection.isSelected</code></td>
        <td><code>(row: T) =&gt; boolean</code></td>
        <td>Wraps <code>getIsItemSelected</code>.</td>
      </tr>
      <tr>
        <td><code>selection.isSelectable</code></td>
        <td><code>(row: T) =&gt; boolean</code></td>
        <td>Wraps <code>getIsItemSelectable</code>, or <code>true</code> when it is omitted.</td>
      </tr>
      <tr>
        <td><code>selection.selectAll</code></td>
        <td><code>(selected: boolean) =&gt; void</code></td>
        <td>Calls <code>onSelectAll</code> with <code>{ isAllSelected: selected }</code>.</td>
      </tr>
      <tr>
        <td><code>selection.selectRow</code></td>
        <td><code>(row: T, selected: boolean) =&gt; void</code></td>
        <td>Calls <code>onSelectItem</code> with <code>{ item: row, isSelected: selected }</code>.</td>
      </tr>
      <tr>
        <td><code>selection.rowLabel</code></td>
        <td><code>(row: T) =&gt; string</code></td>
        <td>Wraps <code>getRowLabel</code>, or an empty string when it is omitted.</td>
      </tr>
      <tr>
        <td><code>selection.hasRowHighlight</code></td>
        <td><code>boolean | undefined</code></td>
        <td>The value from the config. Anything other than <code>false</code> keeps the wash.</td>
      </tr>
    </tbody>
  </table>
</div>

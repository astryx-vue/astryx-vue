---
layout: component-docs
title: useTableSelectionState
outline: false
footer: false
---

`data` and `selectedKeys` are `MaybeRefOrGetter`, so a ref or a getter keeps the state live. The other fields are read from the config object you pass.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableSelectionState parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td>
        <td>—</td>
        <td>The full data array rendered in the table.</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>keyof T &amp; string</code></td>
        <td>—</td>
        <td>Key extractor: the property name that holds a unique string ID.</td>
      </tr>
      <tr>
        <td><code>selectedKeys</code></td>
        <td><code>MaybeRefOrGetter&lt;ReadonlySet&lt;string&gt;&gt;</code></td>
        <td>—</td>
        <td>Controlled set of selected item IDs.</td>
      </tr>
      <tr>
        <td><code>setSelectedKeys</code></td>
        <td><code>(keys: Set&lt;string&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>Setter for the controlled selected keys. Receives a new <code>Set</code>; assign it to your own ref.</td>
      </tr>
      <tr>
        <td><code>getRowLabel</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>Passed through to the selection plugin as the row checkbox label.</td>
      </tr>
      <tr>
        <td><code>hasRowHighlight</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Passed through to the selection plugin. <code>false</code> drops the accent wash on checked rows and keeps <code>aria-selected</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableSelectionState returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>selectionConfig</code></td>
        <td><code>UseTableSelectionConfig&lt;T&gt; &amp; { readonly rows: readonly T[] }</code></td>
        <td>Everything <code>useTableSelection</code> needs. It also carries a <code>rows</code> getter with the current data, so a select-all handler that wants the rows can read them from the config.</td>
      </tr>
      <tr>
        <td><code>selectionState</code></td>
        <td><code>TableSelectionState</code></td>
        <td>Read-only snapshot for selection-aware UI. Pass it to <code>TableSelectionToolbar</code> and the toolbar hides itself while nothing is selected.</td>
      </tr>
      <tr>
        <td><code>selectionState.selectedKeys</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>Every selected key, including rows that are not on the current page.</td>
      </tr>
      <tr>
        <td><code>selectionState.selectedCount</code></td>
        <td><code>number</code></td>
        <td>How many keys are selected.</td>
      </tr>
      <tr>
        <td><code>selectionState.hasSelection</code></td>
        <td><code>boolean</code></td>
        <td>True when at least one key is selected.</td>
      </tr>
      <tr>
        <td><code>selectionState.clearSelection</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Calls <code>setSelectedKeys</code> with an empty <code>Set</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

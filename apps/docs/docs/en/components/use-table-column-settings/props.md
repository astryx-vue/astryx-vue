---
layout: component-docs
title: useTableColumnSettings
outline: false
footer: false
---

## Parameters

`useTableColumnSettings()` takes one config object. Wrap it in a getter or a `ref` so the table reads the current keys: `useTableColumnSettings(() => state.columnSettingsConfig)`.

<div class="component-api-table" role="region" aria-label="useTableColumnSettings parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>readonly ColumnSettingsOption&lt;TColumnKey&gt;[]</code></td>
        <td>—</td>
        <td>Required. All available columns with metadata for the settings UI. Each entry has <code>key</code>, <code>label</code>, and an optional <code>isAlwaysVisible</code>.</td>
      </tr>
      <tr>
        <td><code>activeColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>—</td>
        <td>Required. Currently active column keys, in display order. Only columns with keys in this array are shown.</td>
      </tr>
      <tr>
        <td><code>onChangeActiveColumnKeys</code></td>
        <td><code>(keys: TColumnKey[]) =&gt; void</code></td>
        <td>—</td>
        <td>Called when active columns change. <code>useTableColumnSettings()</code> never calls it; it belongs to the config that <code>useTableColumnSettingsState()</code> hands back.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

`useTableColumnSettings()` returns one `TablePlugin&lt;T&gt;`. Pass it to `Table` in `plugins`. The plugin fills one field of the plugin contract:

<div class="component-api-table" role="region" aria-label="useTableColumnSettings returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>Drops the columns that are not in <code>activeColumnKeys</code>, then sorts the rest into that array's order.</td>
      </tr>
    </tbody>
  </table>
</div>

## useTableColumnSettingsState

The companion hook. It holds the keys, and every write goes through it so `isAlwaysVisible` columns cannot be removed.

```ts
const state = useTableColumnSettingsState({
  columns: columnOptions,
  activeColumnKeys: activeKeys,
  onChangeActiveColumnKeys(keys) {
    activeKeys.value = [...keys]
  },
})
const plugin = useTableColumnSettings(state.columnSettingsConfig)
```

<div class="component-api-table" role="region" aria-label="useTableColumnSettingsState returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>activeColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>The keys you passed in, read through on every access.</td>
      </tr>
      <tr>
        <td><code>setActiveColumnKeys</code></td>
        <td><code>(keys: readonly TColumnKey[]) =&gt; void</code></td>
        <td>Puts every <code>isAlwaysVisible</code> key back at the front of the list and calls <code>onChangeActiveColumnKeys</code>.</td>
      </tr>
      <tr>
        <td><code>columnSettingsConfig</code></td>
        <td><code>UseTableColumnSettingsConfig&lt;TColumnKey&gt;</code></td>
        <td>Config for <code>useTableColumnSettings()</code>, wired to <code>setActiveColumnKeys</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

### ColumnSettingsOption

<div class="component-api-table" role="region" aria-label="ColumnSettingsOption fields" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>key</code></td>
        <td><code>TColumnKey</code></td>
        <td>—</td>
        <td>Column key. It must match a <code>TableColumn.key</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Human-readable label for the settings UI.</td>
      </tr>
      <tr>
        <td><code>isAlwaysVisible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>The column cannot be hidden. Use it for essential columns such as Name or ID.</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useTableColumnSettings
outline: false
footer: false
---

## 参数

`useTableColumnSettings()` 只接一个配置对象。key 存在 `ref` 里时用 getter 包一层，表格每次读都能拿到最新的值：`useTableColumnSettings(() => state.columnSettingsConfig)`。

<div class="component-api-table" role="region" aria-label="useTableColumnSettings 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>readonly ColumnSettingsOption&lt;TColumnKey&gt;[]</code></td>
        <td>—</td>
        <td>必填。全部可选的列，带设置界面要用的信息。每一项有 <code>key</code>、<code>label</code>，还可以有 <code>isAlwaysVisible</code> 和 <code>group</code>。</td>
      </tr>
      <tr>
        <td><code>activeColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>—</td>
        <td>必填。当前打开的列 key，按显示顺序。只有 key 在这个数组里的列会显示。</td>
      </tr>
      <tr>
        <td><code>onChangeActiveColumnKeys</code></td>
        <td><code>(keys: TColumnKey[]) =&gt; void</code></td>
        <td>—</td>
        <td>打开的列变了时调用。<code>useTableColumnSettings()</code> 自己不会调它；它属于 <code>useTableColumnSettingsState()</code> 交回来的那份配置。</td>
      </tr>
      <tr>
        <td><code>defaultColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>—</td>
        <td>「恢复默认」用的那组列。不传就恢复成全部列。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableColumnSettings()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件约定里的一个字段：

<div class="component-api-table" role="region" aria-label="useTableColumnSettings 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>丢掉 key 不在 <code>activeColumnKeys</code> 里的列，再把剩下的按这个数组的顺序排好。</td>
      </tr>
    </tbody>
  </table>
</div>

## useTableColumnSettingsState

配套的组合式函数。它替你拿住这些 key，所有写入都走它，所以 `isAlwaysVisible` 的列不会被删掉。

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

参数和上面那份配置一样，另外多一个 `defaultColumnKeys`。

<div class="component-api-table" role="region" aria-label="useTableColumnSettingsState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>activeColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>你传进来的 key，每次读都重新取值。</td>
      </tr>
      <tr>
        <td><code>toggleColumn</code></td>
        <td><code>(key: TColumnKey) =&gt; void</code></td>
        <td>开关一列。<code>isAlwaysVisible</code> 的 key 会被忽略。</td>
      </tr>
      <tr>
        <td><code>isColumnActive</code></td>
        <td><code>(key: TColumnKey) =&gt; boolean</code></td>
        <td>这一列现在是打开的吗。用来勾选选择器里的选项。</td>
      </tr>
      <tr>
        <td><code>isColumnToggleable</code></td>
        <td><code>(key: TColumnKey) =&gt; boolean</code></td>
        <td>这一列允许被关掉吗。<code>isAlwaysVisible</code> 的列是 <code>false</code>，选择器里把它标成禁用。</td>
      </tr>
      <tr>
        <td><code>showAllColumns</code></td>
        <td><code>() =&gt; void</code></td>
        <td>把 <code>columns</code> 里的全部列报成打开。</td>
      </tr>
      <tr>
        <td><code>resetToDefault</code></td>
        <td><code>() =&gt; void</code></td>
        <td>报出 <code>defaultColumnKeys</code>，没设就报出全部列。「恢复默认」按钮调它。</td>
      </tr>
      <tr>
        <td><code>setActiveColumnKeys</code></td>
        <td><code>(keys: readonly TColumnKey[]) =&gt; void</code></td>
        <td>把给的 key 补上所有 <code>isAlwaysVisible</code> 的 key 再报出去，然后调 <code>onChangeActiveColumnKeys</code>。</td>
      </tr>
      <tr>
        <td><code>columnSettingsConfig</code></td>
        <td><code>UseTableColumnSettingsConfig&lt;TColumnKey&gt;</code></td>
        <td>给 <code>useTableColumnSettings()</code> 用的配置，写入接到 <code>setActiveColumnKeys</code>，并带上 <code>defaultColumnKeys</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

### ColumnSettingsOption

<div class="component-api-table" role="region" aria-label="ColumnSettingsOption 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>key</code></td>
        <td><code>TColumnKey</code></td>
        <td>—</td>
        <td>列的 key，必须和某个 <code>TableColumn.key</code> 一致。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>设置界面里显示的名字。</td>
      </tr>
      <tr>
        <td><code>isAlwaysVisible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>这一列不能被隐藏。用在 Name、ID 这种必须留着的列上。</td>
      </tr>
      <tr>
        <td><code>group</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>分组名。同组的列在设置列表里排在一起，可以带个小标题。</td>
      </tr>
    </tbody>
  </table>
</div>

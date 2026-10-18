---
layout: component-docs
title: useTableColumnSettings
outline: false
footer: false
---

## 参数

`useTableColumnSettings()` 只有一个配置对象。用 getter 或 `ref` 包一层，表格才能读到最新的 key：`useTableColumnSettings(() => state.columnSettingsConfig)`。

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
        <td>必填。全部可选的列，带设置界面要用的信息。每项有 <code>key</code>、<code>label</code>，以及可选的 <code>isAlwaysVisible</code>。</td>
      </tr>
      <tr>
        <td><code>activeColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>—</td>
        <td>必填。当前显示的列 key，按显示顺序排。不在这个数组里的列不显示。</td>
      </tr>
      <tr>
        <td><code>onChangeActiveColumnKeys</code></td>
        <td><code>(keys: TColumnKey[]) =&gt; void</code></td>
        <td>—</td>
        <td>显示列变化时调用。<code>useTableColumnSettings()</code> 自己不会调用它；它属于 <code>useTableColumnSettingsState()</code> 交回的那份配置。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableColumnSettings()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件协议上的一个字段：

<div class="component-api-table" role="region" aria-label="useTableColumnSettings 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>去掉不在 <code>activeColumnKeys</code> 里的列，再把剩下的按这个数组的顺序排好。</td>
      </tr>
    </tbody>
  </table>
</div>

## useTableColumnSettingsState

配套的状态助手。它保存 key，每次写入都经过它，所以 `isAlwaysVisible` 的列删不掉。

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

<div class="component-api-table" role="region" aria-label="useTableColumnSettingsState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>activeColumnKeys</code></td>
        <td><code>readonly TColumnKey[]</code></td>
        <td>你传进来的 key，每次访问都重新取。</td>
      </tr>
      <tr>
        <td><code>setActiveColumnKeys</code></td>
        <td><code>(keys: readonly TColumnKey[]) =&gt; void</code></td>
        <td>把每个 <code>isAlwaysVisible</code> 的 key 放回列表最前面，然后调用 <code>onChangeActiveColumnKeys</code>。</td>
      </tr>
      <tr>
        <td><code>columnSettingsConfig</code></td>
        <td><code>UseTableColumnSettingsConfig&lt;TColumnKey&gt;</code></td>
        <td>交给 <code>useTableColumnSettings()</code> 的配置，写入已经接到 <code>setActiveColumnKeys</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

### ColumnSettingsOption

<div class="component-api-table" role="region" aria-label="ColumnSettingsOption 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>key</code></td>
        <td><code>TColumnKey</code></td>
        <td>—</td>
        <td>列的 key，必须和某个 <code>TableColumn.key</code> 对上。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>设置界面显示的名字。</td>
      </tr>
      <tr>
        <td><code>isAlwaysVisible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>这一列不能隐藏。给 Name、ID 这类必不可少的列加。</td>
      </tr>
    </tbody>
  </table>
</div>

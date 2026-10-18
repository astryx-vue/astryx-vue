---
layout: component-docs
title: useTableSelectionState
outline: false
footer: false
---

`data` 和 `selectedKeys` 是 `MaybeRefOrGetter`，传 ref 或 getter 才能保持实时。其它字段从你传入的配置对象上读。

## 参数

<div class="component-api-table" role="region" aria-label="useTableSelectionState 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td>
        <td>—</td>
        <td>表格里渲染的完整数据数组。</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>keyof T &amp; string</code></td>
        <td>—</td>
        <td>键提取：存放唯一字符串 ID 的属性名。</td>
      </tr>
      <tr>
        <td><code>selectedKeys</code></td>
        <td><code>MaybeRefOrGetter&lt;ReadonlySet&lt;string&gt;&gt;</code></td>
        <td>—</td>
        <td>受控的选中 ID 集合。</td>
      </tr>
      <tr>
        <td><code>setSelectedKeys</code></td>
        <td><code>(keys: Set&lt;string&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>选中集合的写回函数。它给的是一个新 <code>Set</code>，你把它赋给自己的 ref 就行。</td>
      </tr>
      <tr>
        <td><code>getRowLabel</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>原样传给选择插件，做行复选框的标签。</td>
      </tr>
      <tr>
        <td><code>hasRowHighlight</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>原样传给选择插件。设成 <code>false</code> 后，选中的行不再铺浅色底，<code>aria-selected</code> 仍然保留。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableSelectionState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>selectionConfig</code></td>
        <td><code>UseTableSelectionConfig&lt;T&gt; &amp; { readonly rows: readonly T[] }</code></td>
        <td><code>useTableSelection</code> 需要的全部内容。另外带一个 <code>rows</code> getter，能直接拿到当前数据，处理全选时不用另外传。</td>
      </tr>
      <tr>
        <td><code>selectionState</code></td>
        <td><code>TableSelectionState</code></td>
        <td>给选择相关界面用的只读快照。传给 <code>TableSelectionToolbar</code> 后，一个都没选中时工具栏自动不渲染。</td>
      </tr>
      <tr>
        <td><code>selectionState.selectedKeys</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>选中的全部键，包含不在当前页上的行。</td>
      </tr>
      <tr>
        <td><code>selectionState.selectedCount</code></td>
        <td><code>number</code></td>
        <td>选中了多少个键。</td>
      </tr>
      <tr>
        <td><code>selectionState.hasSelection</code></td>
        <td><code>boolean</code></td>
        <td>至少选中一个键时为 true。</td>
      </tr>
      <tr>
        <td><code>selectionState.clearSelection</code></td>
        <td><code>() =&gt; void</code></td>
        <td>用一个空 <code>Set</code> 调 <code>setSelectedKeys</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useTableSelection
outline: false
footer: false
---

配置对象是 `MaybeRefOrGetter`：传一个 getter 或 ref，插件才会跟着最新值走。

## 参数

<div class="component-api-table" role="region" aria-label="useTableSelection 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getIsItemSelected</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td>—</td>
        <td>这一行现在是否被选中。</td>
      </tr>
      <tr>
        <td><code>onSelectItem</code></td>
        <td><code>(event: { item: T; isSelected: boolean }) =&gt; void</code></td>
        <td>—</td>
        <td>行的复选框被切换时调用。<code>isSelected</code> 是切换后的目标状态。</td>
      </tr>
      <tr>
        <td><code>onSelectAll</code></td>
        <td><code>(event: { isAllSelected: boolean }) =&gt; void</code></td>
        <td>—</td>
        <td>表头的全选复选框被切换时调用。</td>
      </tr>
      <tr>
        <td><code>getIsAllSelected</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>—</td>
        <td>所有可选行现在是否都被选中。</td>
      </tr>
      <tr>
        <td><code>getIsIndeterminate</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td><code>() =&gt; false</code></td>
        <td>是否只选中了一部分（有选中的，也有没选的）。全选复选框会显示成半选状态。</td>
      </tr>
      <tr>
        <td><code>getIsItemSelectable</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td><code>() =&gt; true</code></td>
        <td>这一行要不要显示复选框。返回 false 的行，选择那一格是空的。</td>
      </tr>
      <tr>
        <td><code>getRowLabel</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>给出一行的人话名字，复选框的隐藏标签会变成「选择 <code>getRowLabel(item)</code>」，读屏软件才知道这个复选框选的是哪一行。不传时用内置的「选择行」。</td>
      </tr>
      <tr>
        <td><code>hasRowHighlight</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>给选中的行铺一层浅色底。如果周围的界面已经用行底色表达别的意思（比如这一行正在详情面板里打开），就设成 false。这层底色是内联样式，外部改不掉。关掉的只是底色，<code>aria-selected</code> 照旧写在选中的行上。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableSelection 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>selection</code></td>
        <td><code>TableSelectionContribution&lt;T&gt;</code></td>
        <td>表格读取的那部分贡献。把整个插件塞进 <code>plugins</code> 的任意一个键里，表格会自己挑出带 <code>selection</code> 的那一个。</td>
      </tr>
      <tr>
        <td><code>selection.isAllSelected</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>转调 <code>getIsAllSelected</code>。</td>
      </tr>
      <tr>
        <td><code>selection.isIndeterminate</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>转调 <code>getIsIndeterminate</code>；没传时返回 <code>false</code>。</td>
      </tr>
      <tr>
        <td><code>selection.isSelected</code></td>
        <td><code>(row: T) =&gt; boolean</code></td>
        <td>转调 <code>getIsItemSelected</code>。</td>
      </tr>
      <tr>
        <td><code>selection.isSelectable</code></td>
        <td><code>(row: T) =&gt; boolean</code></td>
        <td>转调 <code>getIsItemSelectable</code>；没传时返回 <code>true</code>。</td>
      </tr>
      <tr>
        <td><code>selection.selectAll</code></td>
        <td><code>(selected: boolean) =&gt; void</code></td>
        <td>用 <code>{ isAllSelected: selected }</code> 调 <code>onSelectAll</code>。</td>
      </tr>
      <tr>
        <td><code>selection.selectRow</code></td>
        <td><code>(row: T, selected: boolean) =&gt; void</code></td>
        <td>用 <code>{ item: row, isSelected: selected }</code> 调 <code>onSelectItem</code>。</td>
      </tr>
      <tr>
        <td><code>selection.rowLabel</code></td>
        <td><code>(row: T) =&gt; string</code></td>
        <td>转调 <code>getRowLabel</code>；没传时返回空字符串。</td>
      </tr>
      <tr>
        <td><code>selection.hasRowHighlight</code></td>
        <td><code>boolean | undefined</code></td>
        <td>配置里的原值。只要不是 <code>false</code>，底色就照旧铺。</td>
      </tr>
    </tbody>
  </table>
</div>

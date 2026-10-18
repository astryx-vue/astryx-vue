---
layout: component-docs
title: useTableSortable
outline: false
footer: false
---

配置对象是 `MaybeRefOrGetter`：传一个 getter 或 ref，插件才会跟着当前排序状态走。

## 参数

<div class="component-api-table" role="region" aria-label="useTableSortable 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sort</code></td>
        <td><code>TableSortState&lt;TSortKey&gt;</code></td>
        <td>—</td>
        <td>当前排序状态：一个有序数组，每项是 <code>{ sortKey, direction }</code>。第一项是主排序，后面的是次级排序。空数组表示不排序。方向写全词：<code>'ascending'</code> / <code>'descending'</code>，不是 <code>'asc'</code> / <code>'desc'</code>。</td>
      </tr>
      <tr>
        <td><code>onSortChange</code></td>
        <td><code>(sort: TableSortState&lt;TSortKey&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>用户点表头改变排序时调用，参数是下一个排序状态。</td>
      </tr>
      <tr>
        <td><code>allowUnsortedState</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否允许转回不排序。为 true 时依次是升序、降序、不排序；为 false 时是升序、降序、升序。</td>
      </tr>
      <tr>
        <td><code>isMultiSortEnabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>允许按住 Shift 再点来加多列排序。普通点击仍然整体替换排序状态。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableSortable 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sortFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableSortContribution | null</code></td>
        <td>给出某个表头该用的排序信息；这一列不能排序时返回 <code>null</code>。列上写了 <code>sortable: true</code> 或 <code>sortable: { sortKey }</code> 才算能排序。</td>
      </tr>
      <tr>
        <td><code>sortFor().direction</code></td>
        <td><code>'ascending' | 'descending' | null</code></td>
        <td>这一列当前的方向，没有排序时是 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>sortFor().rank</code></td>
        <td><code>number | null</code></td>
        <td>多列排序时它排第几（从 1 计），显示在箭头旁边。只排了一列时是 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>sortFor().label</code></td>
        <td><code>string</code></td>
        <td>表头按钮的本地化无障碍名称，例如「按名称排序。改为降序」。</td>
      </tr>
      <tr>
        <td><code>sortFor().onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>点击处理函数。普通点击整体替换排序状态；按住 Shift 点击会加上、改向或去掉这一列。Shift 从事件上读。</td>
      </tr>
    </tbody>
  </table>
</div>

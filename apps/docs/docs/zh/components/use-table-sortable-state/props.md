---
layout: component-docs
title: useTableSortableState
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useTableSortableState 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td>
        <td>必填</td>
        <td>要排序的行。会变的话传 ref 或 getter。</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly TableColumn&lt;T&gt;[]&gt;</code></td>
        <td><code>[]</code></td>
        <td>表格的列。列的 <code>sortable.sortKey</code> 和 <code>sortable.compare</code> 决定它的键怎么排。</td>
      </tr>
      <tr>
        <td><code>defaultSort</code></td>
        <td><code>MaybeRefOrGetter&lt;TableSortState&gt;</code></td>
        <td><code>[]</code></td>
        <td>表格一开始的排序，只读一次。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableSortableState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sortedData</code></td>
        <td><code>ComputedRef&lt;T[]&gt;</code></td>
        <td>排好序的 <code>data</code> 副本。没有排序时保持原来的顺序。</td>
      </tr>
      <tr>
        <td><code>sort</code></td>
        <td><code>Ref&lt;TableSortState&gt;</code></td>
        <td>当前的排序：按优先级排列的 <code>{ sortKey, direction }</code>。在代码里改排序就给它赋值。</td>
      </tr>
      <tr>
        <td><code>sortConfig</code></td>
        <td><code>UseTableSortableConfig</code></td>
        <td>交给 <code>useTableSortable</code> 的配置：<code>sort</code> 读当前状态，<code>onSortChange</code> 写回去。</td>
      </tr>
    </tbody>
  </table>
</div>

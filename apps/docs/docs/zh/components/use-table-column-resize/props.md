---
layout: component-docs
title: useTableColumnResize
outline: false
footer: false
---

## 参数

`useTableColumnResize()` 只有一个配置对象。用 getter 或 `ref` 包一层，表格才能读到最新的宽度：`useTableColumnResize(() => ({ ... }))`。

<div class="component-api-table" role="region" aria-label="useTableColumnResize 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columnWidths</code></td>
        <td><code>Record&lt;string, number&gt;</code></td>
        <td>—</td>
        <td>必填。按列 key 存的像素宽度覆盖值。有对应的 key 时，它盖过列上写的宽度。</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(updates: Record&lt;string, number&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>必填。一次拖动结束时调用。收到的是宽度变了的列的映射，把它并进你的 <code>columnWidths</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableColumnResize()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件协议上的两个字段：

<div class="component-api-table" role="region" aria-label="useTableColumnResize 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>widthFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; number | undefined</code></td>
        <td>给出一列的宽度覆盖值。这列没有覆盖值时是 <code>undefined</code>。</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(key: string, width: number) =&gt; void</code></td>
        <td><code>Table</code> 用它交来提交的宽度。它会四舍五入、保证不小于 60px，再交给你的 <code>onColumnResizeEnd</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

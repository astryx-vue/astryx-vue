---
layout: component-docs
title: useTableStickyColumns
outline: false
footer: false
---

配置对象是 `MaybeRefOrGetter`：传一个 getter 或 ref，就能在运行时改固定哪些列。

## 参数

<div class="component-api-table" role="region" aria-label="useTableStickyColumns 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>startKeys</code></td>
        <td><code>readonly string[]</code></td>
        <td>—</td>
        <td>固定在开头边缘（行内起点，从左往右排版时是左边）的列键。实际固定的是从第一列到你写的最后一个键之间这一段连续的列。</td>
      </tr>
      <tr>
        <td><code>endKeys</code></td>
        <td><code>readonly string[]</code></td>
        <td>—</td>
        <td>固定在末尾边缘（行内终点，从左往右排版时是右边）的列键。实际固定的是从你写的第一个键到最后一列之间这一段连续的列。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableStickyColumns 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>cellPatch</code></td>
        <td><code>(input: TableCellPatchInput&lt;T&gt;) =&gt; TableCellPatch | null</code></td>
        <td>把表头或表体的某一格标成固定。偏移量按固定段累加：每固定一列，就把前一列的最小宽度加上去。不固定的列返回 <code>null</code>；两个键列表都为空时，所有列都返回 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>bindScrollRoot</code></td>
        <td><code>(element: HTMLElement | null) =&gt; void</code></td>
        <td>表格把自己的滚动容器交给它，卸载时再传一次 <code>null</code>。它在这个容器上监听滚动和尺寸变化，把 <code>--table-sticky-shadow-start</code> / <code>--table-sticky-shadow-end</code> 写成 <code>'1'</code> 或 <code>'0'</code>，阴影就靠这两个值出现或消失。作用域销毁时监听会自动摘掉。</td>
      </tr>
    </tbody>
  </table>
</div>

固定住的单元格拿到的补丁是：`position: sticky`、一个开头或末尾方向的 inset、`z-index` 表头 3 表体 1，以及 `astryx-table__sticky` 加上 `astryx-table__sticky--start` 或 `astryx-table__sticky--end` 两个类。

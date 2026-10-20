---
layout: component-docs
title: useTableRowIndex
outline: false
footer: false
---

配置对象是 `MaybeRefOrGetter`：传一个 getter 或 ref，插件才会跟着最新值走。

## 参数

<div class="component-api-table" role="region" aria-label="useTableRowIndex 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>readonly T[]</code></td>
        <td>—</td>
        <td>表格当前渲染的数据数组（排序、过滤、分页之后）。序号按这个顺序走。</td>
      </tr>
      <tr>
        <td><code>getRowKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>可选的行键提取函数，给每一行返回唯一字符串。传了就用这个字符串查序号，不传就按引用相等来认行。放在 getter 里的普通函数本身是稳定的，不需要额外缓存。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'#'</code></td>
        <td>序号列的表头文字。</td>
      </tr>
      <tr>
        <td><code>startFrom</code></td>
        <td><code>number</code></td>
        <td><code>1</code></td>
        <td>第一个序号的值。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableRowIndex 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>在最前面加序号列。列键是 <code>__rowIndex</code>，宽 <code>pixel(48)</code>，靠末尾对齐，不能拖宽。分组头那一行的单元格是空的。数字放在 <code>span.astryx-table__row-index</code> 里，等宽字体、右对齐。</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: 分页
outline: false
footer: false
---

## Pagination Props

<div class="component-api-table" role="region" aria-label="Pagination Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>page</code></td><td><code>number</code></td><td><code>1</code></td><td>当前页码，从 1 开始。</td></tr>
      <tr><td><code>pageSize</code></td><td><code>number</code></td><td><code>10</code></td><td>每页条目数。</td></tr>
      <tr><td><code>total</code></td><td><code>number</code></td><td><code>0</code></td><td>总条目数。</td></tr>
      <tr><td><code>showSizeChanger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示每页数量选择器。</td></tr>
      <tr><td><code>pageSizeOptions</code></td><td><code>number[]</code></td><td><code>[10, 20, 50, 100]</code></td><td>每页数量选项。</td></tr>
      <tr><td><code>showTotal</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示总条目数。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>prevLabel</code></td><td><code>string</code></td><td>—</td><td>上一页按钮文字。</td></tr>
      <tr><td><code>nextLabel</code></td><td><code>string</code></td><td>—</td><td>下一页按钮文字。</td></tr>
      <tr><td><code>pageSizeLabel</code></td><td><code>string</code></td><td><code>'每页'</code></td><td>每页数量选择器的标签。</td></tr>
    </tbody>
  </table>
</div>

## Pagination 事件

<div class="component-api-table" role="region" aria-label="Pagination 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:page</code></td><td><code>page: number</code></td><td>页码变化时触发。</td></tr>
      <tr><td><code>update:pageSize</code></td><td><code>pageSize: number</code></td><td>每页数量变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>page: number, pageSize: number</code></td><td>页码或每页数量变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## Pagination 插槽

<div class="component-api-table" role="region" aria-label="Pagination 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>total</code></td><td><code>{ total, from, to }</code></td><td>自定义总数显示。</td></tr>
    </tbody>
  </table>
</div>

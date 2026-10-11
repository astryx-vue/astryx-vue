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
      <tr><td><code>page</code></td><td><code>number</code></td><td><code>1</code></td><td>当前页码。</td></tr>
      <tr><td><code>pageSize</code></td><td><code>number</code></td><td><code>10</code></td><td>每页条目数。</td></tr>
      <tr><td><code>total</code></td><td><code>number</code></td><td>必需</td><td>总条目数。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>showSizeChanger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示每页数量选择器。</td></tr>
      <tr><td><code>pageSizeOptions</code></td><td><code>number[]</code></td><td><code>[10, 20, 50, 100]</code></td><td>每页数量选项。</td></tr>
      <tr><td><code>showQuickJumper</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示快速跳转。</td></tr>
      <tr><td><code>showTotal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示总条目数。</td></tr>
      <tr><td><code>simple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>简洁模式。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
    </tbody>
  </table>
</div>

## Pagination Emits

<div class="component-api-table" role="region" aria-label="Pagination Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:page</code></td><td><code>page: number</code></td><td>页码变化时触发。</td></tr>
      <tr><td><code>update:pageSize</code></td><td><code>pageSize: number</code></td><td>每页数量变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>{ page: number, pageSize: number }</code></td><td>页码或每页数量变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## Pagination Slots

<div class="component-api-table" role="region" aria-label="Pagination Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>total</code></td><td><code>{ total: number, range: [number, number] }</code></td><td>自定义总数显示。</td></tr>
    </tbody>
  </table>
</div>

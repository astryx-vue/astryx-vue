---
layout: component-docs
title: useSnapPaging
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useSnapPaging 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;SnapPagingOptions&gt;</code></td>
        <td><code>{}</code></td>
        <td>翻页选项，也可以是返回选项的 ref 或 getter。每次轻扫时读取，新值从下一次轻扫开始生效。</td>
      </tr>
      <tr>
        <td><code>options.pages</code></td>
        <td><code>'view' | 'item'</code></td>
        <td><code>'view'</code></td>
        <td>一次轻扫翻多少。<code>'view'</code> 翻一屏，停在离一屏之外最近的那一项起始边；<code>'item'</code> 翻一项。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useSnapPaging 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>paging</code></td>
        <td><code>SnapPaging</code></td>
        <td>交给轮播 <code>hasSnap</code> 的吸附分页。轮播挂载时把它挂到滚动区上，并一直用第一次挂上的那个值；改回 <code>true</code> 或 <code>false</code> 时卸下。</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useMergedRefs
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useMergedRefs 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>refs</code></td>
        <td><code>readonly MergedRef&lt;T&gt;[]</code></td>
        <td>—</td>
        <td>最多六个目标，它们会收到同一个元素。每一项可以是 <code>Ref&lt;T | null&gt;</code>、函数 ref、<code>null</code> 或 <code>undefined</code>；空着的位置直接跳过。必填。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useMergedRefs 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mergedRef</code></td>
        <td><code>(value: Element | ComponentPublicInstance | null) =&gt; void</code></td>
        <td>合并出来的函数 ref，组件存活期间一直是同一个函数。它接收 Vue 交给模板 ref 的任何值，卸载时也会收到 <code>null</code>，然后转发给 <code>refs</code> 里的每一项。</td>
      </tr>
    </tbody>
  </table>
</div>

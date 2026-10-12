---
layout: component-docs
title: 表单布局
outline: false
footer: false
---

## Form Layout Props

<div class="component-api-table" role="region" aria-label="Form Layout Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>direction</code></td>
        <td><code>'vertical' | 'horizontal' | 'horizontal-labels'</code></td>
        <td><code>'vertical'</code></td>
        <td>字段怎么排。<code>horizontal</code> 是等宽的列。<code>horizontal-labels</code> 把标签放在左边，窄于 480px 时改成纵向。</td>
      </tr>
      <tr>
        <td><code>defaultOptionality</code></td>
        <td><code>'optional' | 'required'</code></td>
        <td>-</td>
        <td>没有自己写 <code>isOptional</code> 或 <code>isRequired</code> 的字段用这个默认值。它改标记和 <code>aria-required</code>，不写原生 <code>required</code>。两个都写时，选填优先。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Form Layout Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>字段。嵌套的 <code>FormLayout</code> 保留自己的方向。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

`FormLayout` 渲染的是 `<div>`，不是 `<form>`。HTML 属性、<code>aria-*</code>、<code>data-*</code>、<code>class</code> 和 <code>style</code> 都落到这个元素上。<code>class</code> 会合并。根元素写 <code>data-direction</code>。

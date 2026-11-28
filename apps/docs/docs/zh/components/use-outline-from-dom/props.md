---
layout: component-docs
title: useOutlineFromDOM
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useOutlineFromDOM 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>container</code></td>
        <td><code>Ref&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>必填</td>
        <td>装着标题的元素。hook 读取它里面的 <code>h1</code> 到 <code>h6</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useOutlineFromDOM 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>Ref&lt;OutlineItem[]&gt;</code></td>
        <td>每个既有 id 又有文字的标题一项，按文档顺序排列，可以直接交给 <code>Outline</code> 的 <code>items</code>。<code>id</code> 是标题的 id，<code>label</code> 是去掉首尾空白的文字，<code>level</code> 是 1 到 6 的级别。</td>
      </tr>
    </tbody>
  </table>
</div>

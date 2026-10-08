---
layout: component-docs
title: 引用
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Blockquote Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>cite</code></td><td><code>string | number</code></td><td>—</td><td>可选的作者或出处，渲染在语义化的 <code>&lt;footer&gt;</code> 与 <code>&lt;cite&gt;</code> 元素中。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Blockquote 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>引用内容。</td></tr>
      <tr><td><code>cite</code></td><td>富文本出处。提供时覆盖同名 Prop。</td></tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<blockquote>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

---
layout: component-docs
title: 表格表头
outline: false
footer: false
---

## 属性

`TableHeader` 没有属性。表头行从默认插槽传入。

## 插槽

<div class="component-api-table" role="region" aria-label="TableHeader 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td><code>&lt;thead&gt;</code> 里的行。每一行是一个 <code>TableRow</code>，行里的单元格用 <code>TableHeaderCell</code>。</td></tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<thead>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

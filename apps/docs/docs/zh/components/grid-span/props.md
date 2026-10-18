---
layout: component-docs
title: 网格跨列
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="GridSpan 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>columns</code></td><td><code>number | 'full'</code></td><td>—</td><td>占几列，渲染成 <code>grid-column: span N</code>。写 <code>'full'</code> 渲染成 <code>grid-column: 1 / -1</code>，不管一共几列都能占满一行。</td></tr>
<tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>占几行，渲染成 <code>grid-row: span N</code>。</td></tr>
</tbody></table>
</div>

两个都不写，这一项就只占一格。

## 插槽

- `default`：这一项的内容。

## 模板引用

`GridSpan` 公开 `element`。
类型为 `HTMLDivElement | null`。

## 原生属性

根元素会接收 HTML 属性、`aria-*` 属性、`data-*` 属性、`class` 和 `style`。`class` 会和组件自己的类合并。`style` 和 `columns`、`rows` 写到同一个属性上时，以属性为准。

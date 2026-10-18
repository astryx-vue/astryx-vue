---
layout: component-docs
title: 表格单元格
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TableCell 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>'start' | 'center' | 'end'</code></td><td>—</td><td>单元格里文字的对齐方式。不传就跟随表格的默认对齐。</td></tr>
<tr><td><code>colSpan</code></td><td><code>number</code></td><td>—</td><td>这个单元格横着跨几列。</td></tr>
<tr><td><code>rowSpan</code></td><td><code>number</code></td><td>—</td><td>这个单元格竖着跨几行。</td></tr>
<tr><td><code>headers</code></td><td><code>string</code></td><td>—</td><td>描述这个单元格的表头单元格 id。读屏软件会连表头一起念出来。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：单元格里的内容。

## 原生属性

根元素为 `<td>`。`class`、`style`、`id` 等其余属性和事件都直接落在它上面，用法和普通表格单元格一样。

---
layout: component-docs
title: 表头单元格
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TableHeaderCell 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>'start' | 'center' | 'end'</code></td><td>—</td><td>表头文字的对齐方式。不传就跟随表格的默认对齐。</td></tr>
<tr><td><code>colSpan</code></td><td><code>number</code></td><td>—</td><td>这个表头单元格横着跨几列。</td></tr>
<tr><td><code>rowSpan</code></td><td><code>number</code></td><td>—</td><td>这个表头单元格竖着跨几行。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：表头单元格里的内容。

## 其它属性

其余属性和事件直接落在 `<th>` 上，所以 `class`、`style`、`id` 的用法和普通表头单元格一样。渲染出来的元素固定带 `scope="col"`，读屏软件靠它把每一列的数据单元格挂到这个表头上。

---
layout: component-docs
title: 表格页脚
outline: false
footer: false
---

## 属性

`TableFooter` 没有自己的属性。要显示的内容全部从默认插槽传进来，其余的都是原生属性。

## 插槽

<div class="component-api-table" role="region" aria-label="TableFooter 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>放进 <code>&lt;tfoot&gt;</code> 的行。必填。</td></tr>
</tbody></table>
</div>

## 原生属性

根元素是 `<tfoot>`。

以下内容落到根元素上：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

React 版用 `xstyle` 写布局样式，要求传 `stylex.create()` 的值。Vue 版没有这个属性，改用 `class` 或 `style`，两者都会落到 `<tfoot>` 上。

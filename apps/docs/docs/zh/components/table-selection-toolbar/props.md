---
layout: component-docs
title: 表格选择工具栏
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TableSelectionToolbar 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td><code>0</code></td><td>选中了几行。没给 <code>selection</code> 时用它。</td></tr>
<tr><td><code>selection</code></td><td><code>TableSelectionState</code></td><td>—</td><td><code>useTableSelectionState</code> 返回的 <code>selectionState</code>。给了就代替 <code>count</code>，并由它驱动清空命令。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>内置文案</td><td>工具栏的无障碍名称。默认是 <code>Bulk actions</code>。</td></tr>
<tr><td><code>clearLabel</code></td><td><code>string</code></td><td>内置文案</td><td>清空整个选择的按钮文字。默认是 <code>Unselect All</code>。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'sm'</code></td><td>工具栏高度档。清空按钮跟着它走。</td></tr>
<tr><td><code>variant</code></td><td><code>SectionVariant</code></td><td><code>'muted'</code></td><td>底色：<code>section</code> 用表面色，<code>muted</code> 用弱化底，<code>transparent</code> 不铺底。</td></tr>
</tbody></table>
</div>

## 事件

- `clear()`：点击清空按钮时触发。传了 `selection` 时，组件自己先把选中的键清空，再发出这个事件。

## 插槽

<div class="component-api-table" role="region" aria-label="TableSelectionToolbar 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>插槽参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>start</code></td><td>—</td><td>产品自己的操作按钮，排在逻辑起点。里面的控件不会自动继承 <code>size</code>，需要自己设。</td></tr>
<tr><td><code>default</code></td><td>—</td><td>位置和 <code>start</code> 一样。留给旧代码；两个都给时以 <code>start</code> 为准。</td></tr>
<tr><td><code>label</code></td><td><code>{ count: number }</code></td><td>换掉可视的计数文字，用来做本地化或业务自己的说法。</td></tr>
</tbody></table>
</div>

## 原生属性

根元素是一个带 `role="toolbar"` 和 `aria-orientation="horizontal"` 的 `<div>`。

以下内容落到根元素上：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

三句文案来自多语言消息：无障碍名称（`Bulk actions`）、计数文字（`{count} selected`）和清空按钮文字（`Unselect All`）。调用 `provideAstryxLocale('zh-CN')` 后变成中文；`label`、`clearLabel` 和 `label` 插槽可以逐个替换它们。

传了 `selection` 且一个都没选中时，整条不渲染。用 `count` 的老写法始终渲染，固定条数的工具栏位置不会跳。

React 专有的两个属性不在 Vue 版里：`xstyle` 换成 `class` 或 `style`，工具栏的位置交给外层布局。`renderSelectionLabel` 和 `startContent` 换成了 `label` 和 `start` 插槽。

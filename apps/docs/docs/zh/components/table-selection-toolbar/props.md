---
layout: component-docs
title: 表格选择工具栏
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TableSelectionToolbar 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>选中了几行。这个数字会画成工具栏开头的计数文字。必填。</td></tr>
</tbody></table>
</div>

## 事件

- `clear()`：点击取消全选时触发。把选中的键清空，计数文字就会跟着变。

## 插槽

- `default`：产品自己的操作按钮。位置在计数文字和取消全选之间。

## 原生属性

根元素是一个带 `role="region"` 的 `<div>`。

以下内容落到根元素上：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

这条工具栏用三句内置文案：区域名称、计数文字和取消全选。默认是 `Bulk actions`、`{count} selected`、`Unselect All`，调用 `provideAstryxLocale('zh-CN')` 后变成中文。React 版的属性是 `selection`、`label`、`renderSelectionLabel`、`clearLabel`、`size`、`variant`、`startContent` 和 `xstyle`。Vue 版把条数交给 `count`，操作按钮放进默认插槽，样式用 `class` 或 `style`；文案改由多语言消息提供，不再通过属性传入。

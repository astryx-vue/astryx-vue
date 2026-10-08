---
layout: component-docs
title: 单选按钮
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Radio 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>必需。该选项的值，选中后作为单选组的当前值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。选项的可见标签，同时作为无障碍名称供屏幕阅读器朗读。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方的补充说明。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>原生 input 元素的 ID，省略时自动生成。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用该选项，禁用后不可选择。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只读。只读的选项仍可见，但无法更改选中状态。</td></tr>
</tbody></table>
</div>

## 事件

- `change(value, event)`：用户选择该选项时触发。

当 Radio 在 RadioGroup 内使用时，事件由 RadioGroup 统一管理。

## 插槽

- `labelIcon`：标签前的装饰图标。

## 使用约束

`Radio` 依赖 `RadioContext` 获取所在组的状态。脱离 RadioGroup 独立使用时，它会退化为无上下文状态，只能渲染一个孤零零的单选按钮。
因此建议始终把 Radio 作为 RadioGroup 或 RadioList 的子项使用。

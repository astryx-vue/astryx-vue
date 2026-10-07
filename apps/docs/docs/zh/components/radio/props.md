---
layout: component-docs
title: 单选按钮
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Radio 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>必需。选项值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。选项的可见标签和无障碍名称。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>原生输入元素的 ID。省略时自动生成。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用当前选项。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只读当前选项。</td></tr>
</tbody></table>
</div>

## 事件

- `change(value, event)`：用户选择该选项时触发。

当 Radio 在 RadioGroup 内使用时，事件由 RadioGroup 统一管理。

## 插槽

- `labelIcon`：标签前的装饰图标。

## 使用约束

`Radio` 依赖 `RadioContext`。独立使用 `Radio` 时，组件会回退到无上下文状态，仅渲染单个单选按钮。
建议始终将 Radio 作为 RadioGroup 或 RadioList 的子项使用。

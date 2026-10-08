---
layout: component-docs
title: 单选组
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="RadioGroup 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | number</code></td><td>—</td><td>必需。当前选中的选项值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。组的可见标签，同时作为整组的无障碍名称。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>组容器的 ID，省略时自动生成。</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>组内所有单选按钮共享的 name，省略时自动生成。</td></tr>
<tr><td><code>options</code></td><td><code>RadioOption[]</code></td><td>—</td><td>以数组形式传入选项。与默认插槽二选一。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>组件宽度，数字按 px 处理。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在组标签下方的补充说明。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>隐藏标签的视觉呈现，但仍保留无障碍名称供屏幕阅读器朗读。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用整组，禁用后所有选项不可选择。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只读。整组仍可见，但无法更改选中状态。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示必填提示，并启用原生必填校验。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示可选提示，优先于 isRequired。</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>可选提示文本。</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>必填提示文本。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>字段状态，包含类型、消息和消息 ID。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>状态消息的显示位置。</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的装饰图标。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁信息按钮的提示文本。</td></tr>
</tbody></table>
</div>

## 状态消息

`status` 包含以下字段：

- `type`：`error`、`warning` 或 `success`。
- `message`：消息文本。
- `messageId`：消息 ID。

默认 `statusVariant` 为 `detached`，消息显示在组下方。

## 事件

- `update:modelValue(value)`：选中值变化后发出。
- `change(value, event)`：模型更新后触发。

`event` 是可取消的 `RadioChangeEvent`。
`event.detail.originalEvent` 保留原生事件。

## 插槽

- `default`：Radio 子项。与 `options` 二选一。
- `labelIcon`：标签前的装饰图标。优先于 `labelIcon` 属性。

## 模板引用

- `element`：`HTMLDivElement | null`。

## 原生属性

`class` 和 `style` 应用于组件外层。
未声明的原生属性和事件传入组容器。

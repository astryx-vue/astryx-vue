---
layout: component-docs
title: 开关
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Switch 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>boolean</code></td><td>—</td><td>必需。当前开关状态。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。控件的无障碍名称。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>原生输入元素的 ID。省略时自动生成。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>开关尺寸。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>组件宽度。数字按 px 处理。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>隐藏标签的视觉显示。保留无障碍名称。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>阻止修改。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。提供原因时，禁用控件仍可聚焦。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>阻止修改。值仍参与表单提交。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示加载状态。阻止重复切换。</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>加载状态的无障碍文本。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示必填提示。启用原生必填校验。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示可选提示。优先于 isRequired。</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>可选提示文本。</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>必填提示文本。</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>表单字段名。优先于原生 name。</td></tr>
<tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>关联表单的 ID。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>状态类型、消息和消息 ID。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>状态消息的显示位置。</td></tr>
<tr><td><code>changeAction</code></td><td><code>SwitchChangeAction</code></td><td>—</td><td>切换后执行的操作。支持 Promise。</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后聚焦输入元素。</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的装饰图标。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息按钮提示。</td></tr>
</tbody></table>
</div>

## 状态消息

`status` 包含以下字段：

- `type`：`error`、`warning` 或 `success`。
- `message`：消息文本。
- `messageId`：消息 ID。

默认 `statusVariant` 为 `detached`，消息显示在开关下方。

## 事件

- `update:modelValue(value)`：用户切换后发出布尔值。
- `change(value, event)`：模型更新后触发。
- `actionError(error, value, event)`：异步操作拒绝或同步抛出错误时触发。

`event` 是可取消的 `SwitchChangeEvent`。
`event.detail.originalEvent` 保留原生事件。
在 `change` 中调用 `event.preventDefault()` 可跳过 `changeAction`。
此操作不会撤销模型更新。

## 异步操作

`changeAction(value, event)` 接收新值和组件事件。

- 操作返回 Promise 时，组件显示加载状态。
- 操作完成前，组件阻止重复切换。
- 父组件的新值优先于临时显示值。
- Promise 成功或失败后，组件清除加载状态。
- 失败时，组件不会撤销写入 `v-model` 的值。
- 使用 `@action-error` 显示失败信息。
- 需要回滚时，由业务层更新绑定值。

## 插槽

- `labelIcon`：标签前的装饰图标。优先于 `labelIcon` 属性。

## 模板引用

- `element`：`HTMLInputElement | null`。
- `focus(options?: FocusOptions)`：聚焦输入元素。
- `blur()`：移除输入焦点。

## 原生属性

`class` 和 `style` 应用于组件外层。
未声明的原生属性和事件传入 `input`。
组件管理 `checked`、`type`、`role` 和核心 ARIA 状态。

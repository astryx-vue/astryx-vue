---
layout: component-docs
title: 复选框
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="属性列表" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>boolean | 'indeterminate'</code></td><td>—</td><td>必需，当前的选中状态，支持布尔值与半选。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需，作为控件无障碍名称的文本。标签同时带 <code>astryx-field-label</code> 和 <code>astryx-checkbox-label</code>，主题可以单独改复选框的标签。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>原生输入元素的 ID，省略时由组件自动生成。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>控件尺寸，sm 为 20px，md 为 24px。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>组件宽度，传入数字时按像素处理。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方的补充说明。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签和说明，但保留它们的无障碍关联。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用控件并阻止修改，禁用字段不参与表单提交。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因的说明文字；提供后，禁用控件仍保持可聚焦，原因通过提示气泡展示。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>只读，阻止修改；已选中的字段仍会参与表单提交。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>显示加载状态，加载期间阻止重复切换。</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>加载状态读给屏幕阅读器的提示文本。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示“必填”提示，并启用原生必填校验。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示“可选”提示，优先于 <code>isRequired</code>。</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>“可选”提示的文字。</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>“必填”提示的文字。</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>表单提交时的字段名，优先于原生 <code>name</code> 属性。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>状态消息，包含状态类型、可选的消息文本和消息 ID。</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的装饰图标。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁信息按钮的提示文字。</td></tr>
<tr><td><code>changeAction</code></td><td><code>CheckboxInputChangeAction</code></td><td>—</td><td>选中状态变化后执行的操作，可返回 Promise 用于异步提交。</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>组件挂载后自动聚焦输入元素。</td></tr>
</tbody></table>
</div>

## 状态消息

`status` 包含以下字段：

- `type`：`'error'`、`'warning'` 或 `'success'`。
- `message`：可选的消息文本。
- `messageId`：可选的消息 ID。

消息显示在复选框下方。错误使用 assertive 播报。警告和成功使用 polite 播报。

## 事件

- `update:modelValue(value)`：用户切换后发出布尔值。
- `change(value, event)`：模型更新后触发。
- `actionError(error, value, event)`：异步操作拒绝或同步抛出错误时触发。

`event` 是可取消的 `CheckboxInputChangeEvent`。
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

## 原生表单

- `htmlName` 或 `name` 设置字段名。
- 原生 `value` 设置提交值。默认值是 `'on'`。
- `value` 不控制选中状态。选中状态由 `v-model` 控制。
- 未选和半选字段不参与提交。
- 只读字段在选中时参与提交。
- 禁用字段不参与提交。
- 带禁用原因的字段使用 `aria-disabled`，并脱离原生表单。
- `isOptional` 优先于 `isRequired`。单独传入的原生 `required` 仍生效。

原生 `form.reset()` 后，组件恢复当前 `v-model`。
需要清空选择时，在表单的 `reset` 事件中更新绑定值。

## 模板引用与属性

- `element`：`HTMLInputElement | null`。
- `focus(options?: FocusOptions)`：聚焦输入元素。
- `blur()`：移除输入焦点。
- `class` 和 `style` 应用于组件外层。
- 未声明的原生属性和事件传入 `input`。
- `aria-labelledby` 和 `aria-describedby` 与组件内部 ID 合并。
- 组件管理 `checked`、`indeterminate`、`type` 和核心 ARIA 状态。

## 插槽

- `labelIcon`：标签前的装饰图标。优先于 `labelIcon` 属性。

## 主题

```css
.my-checkbox {
  --astryx-checkbox-accent: #047857;
  --astryx-checkbox-on-accent: #fff;
  --astryx-checkbox-focus: #047857;
}
```

- `--astryx-checkbox-background`：未选背景。
- `--astryx-checkbox-border`：未选边框。
- `--astryx-checkbox-accent`：选中与半选背景。
- `--astryx-checkbox-on-accent`：选中标记颜色。
- `--astryx-checkbox-focus`：键盘焦点颜色。
- `--astryx-checkbox-disabled-background`：禁用且未选时的背景。
- `--astryx-radius-inner`：指示器圆角。

Neutral 自动适配 `color-scheme`。
使用 `data-astryx-color-mode="light"` 或 `"dark"` 可指定模式。

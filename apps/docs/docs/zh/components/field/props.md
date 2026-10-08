---
layout: component-docs
title: 表单字段
outline: false
footer: false
---

## Field Props

<div class="component-api-table" role="region" aria-label="Field Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段的可见标签；即使视觉上隐藏，也仍作为控件的无障碍名称。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签和说明，但保留它们与控件的无障碍关联。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方、控件上方的补充说明。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用状态。Field 和 FieldLabel 只调整标签样式，控件本身由使用方禁用。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示“可选”提示；与 <code>isRequired</code> 同时设置时优先。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示“必填”提示；在 <code>TextInput</code> 中还会同时设置 <code>aria-required</code>。</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的 Vue 图标组件；<code>labelIcon</code> 插槽优先于该属性。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息按钮，提示内容支持悬停、键盘聚焦和点击查看。</td></tr>
      <tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>“可选”提示的本地化文字。</td></tr>
      <tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>“必填”提示的本地化文字。</td></tr>
      <tr><td><code>inputId</code></td><td><code>string</code></td><td>必需</td><td>被标记控件的 ID，必须与内部控件的 <code>id</code> 一致。</td></tr>
      <tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>标签自身的 ID；作为分组标签时，由分组容器通过 <code>aria-labelledby</code> 引用。</td></tr>
      <tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>说明文字的 ID，控件通过 <code>aria-describedby</code> 引用它。</td></tr>
      <tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>为 <code>radiogroup</code> 等分组输出 <code>span</code> 而不是 <code>label</code>，避免把分组当作单个控件。</td></tr>
      <tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>字段状态，包含状态类型、可选的消息文本和自定义 <code>messageId</code>。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27; | &#x27;tooltip&#x27;</code></td><td>attached</td><td><code>tooltip</code> 隐藏行内消息框，但保留描述与屏幕阅读器播报，提示按钮由内部控件自行提供。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>整个字段的宽度，传入数字时按像素处理。</td></tr>
    </tbody>
  </table>
</div>

## FieldLabel Props

<div class="component-api-table" role="region" aria-label="FieldLabel Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>可见标签。隐藏时仍为控件提供名称。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>视觉上隐藏标签和说明，保留无障碍关联。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方、控件上方的补充说明。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用状态。Field/FieldLabel 只改变标签样式，控件由使用方禁用。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。与 isRequired 同时设置时优先。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示。TextInput 同时设置 aria-required。</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的 Vue 图标组件。labelIcon 插槽优先。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息按钮，支持悬停、键盘聚焦和点击。</td></tr>
      <tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示的本地化文字。</td></tr>
      <tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示的本地化文字。</td></tr>
      <tr><td><code>inputId</code></td><td><code>string</code></td><td>必需</td><td>被标记控件的 ID。必须与控件 id 相同。</td></tr>
      <tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>标签自身 ID。分组使用 aria-labelledby 引用。</td></tr>
      <tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>说明 ID。控件通过 aria-describedby 引用。</td></tr>
      <tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>为 radiogroup 等分组输出 span，避免把分组当作单个控件。</td></tr>
    </tbody>
  </table>
</div>

## FieldStatus Props

<div class="component-api-table" role="region" aria-label="FieldStatus Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>type</code></td><td><code>&#x27;error&#x27; | &#x27;warning&#x27; | &#x27;success&#x27;</code></td><td>必需</td><td>状态语义与配色。</td></tr>
      <tr><td><code>message</code></td><td><code>string</code></td><td>必需</td><td>状态文字。空字符串不显示消息框。</td></tr>
      <tr><td><code>variant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27;</code></td><td>attached</td><td>attached 与有边框的控件重叠。detached 适合滑块、开关等。</td></tr>
      <tr><td><code>isVisuallyHidden</code></td><td><code>boolean</code></td><td>false</td><td>只保留无障碍描述和播报，用于控件自行提供 tooltip 的场景。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

Field 的 default 为必需插槽，接收以下参数：

```ts
interface FieldSlotProps {
  inputId: string
  labelId: string
  descriptionId?: string
  statusId?: string
  describedBy?: string
}
```

- `Field` 和 `FieldLabel` 提供 `labelIcon` 插槽。
- `labelIcon` 插槽覆盖同名属性。
- 图标只作装饰用途。
- `FieldStatus` 不提供插槽。文字通过 `message` 传入。

## 状态消息

```ts
interface FieldStatusInput {
  type: 'error' | 'warning' | 'success'
  message?: string
  messageId?: string
}
```

### 播报规则

- `error` 使用 `aria-live="assertive"` 区域。
- `warning` 使用 `aria-live="polite"` 区域。
- `success` 使用 `aria-live="polite"` 区域。
- 消息变化时，组件重新播报消息。
- 消息为空时，组件清空播报区域。
- 视觉消息不重复设置 `aria-live`。

### 消息布局

- `attached`：消息紧贴控件。必须放在 `Field` 内有边框的控件下方。
- `detached`：消息与控件分离。消息包含状态图标。
- `Field` 的 `tooltip` 模式：隐藏文字仍用于描述和播报。内部控件负责提供提示按钮。

独立使用 `FieldStatus` 时，使用 `detached`。

## 事件

这三个组件不声明自定义事件。

## 模板引用

每个组件都公开 `element`：

| 组件 | 元素 |
| --- | --- |
| `Field` | 字段根 `div`。 |
| `FieldLabel` | 标签元素或分组 `span`。 |
| `FieldStatus` | 视觉消息元素。 |

挂载前，`element` 为 `null`。
没有消息时，`FieldStatus.element` 为 `null`。

## 原生属性

| 组件 | 属性接收位置 |
| --- | --- |
| `Field` | 字段根元素。 |
| `FieldLabel` | 标签组。 |
| `FieldStatus` | 消息元素。 |

以下内容必须直接传给内部控件：

- `name`。
- `required`。
- `disabled`。
- 控件事件监听器。

## 导入

```ts
import type { FieldProps, FieldSlotProps, FieldStatusInput } from '@astryx-vue/core/Field'
import { Field, FieldLabel, FieldStatus } from '@astryx-vue/core/Field'
import '@astryx-vue/themes/neutral.css'
```

## 主题

- `--astryx-spacing-1`：字段内容间距。
- `--astryx-spacing-2`：分离状态消息的内边距。
- `--astryx-radius-element`：状态消息圆角。
- `--astryx-color-text-secondary`：辅助文字颜色。
- `--astryx-text-label-size`：标签字号。
- `--astryx-text-supporting-size`：说明与状态消息字号。

状态颜色与 `TextInput` 共用变量。完整列表见 [TextInput 校验状态](/components/text-input/props#校验状态)。

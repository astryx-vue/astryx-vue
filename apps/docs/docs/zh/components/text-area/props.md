---
layout: component-docs
title: 文本域
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="属性列表" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>必需。文本域的内容，通过 v-model 双向绑定。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。字段的可见标签。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>关联 ID 的前缀，省略时自动生成。</td></tr>
<tr><td><code>size</code></td><td><code>&#x27;sm&#x27; | &#x27;md&#x27; | &#x27;lg&#x27;</code></td><td>md</td><td>文本域的高度尺寸。</td></tr>
<tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>原生 textarea 的 rows 属性。</td></tr>
<tr><td><code>cols</code></td><td><code>number</code></td><td>—</td><td>原生 textarea 的 cols 属性。</td></tr>
<tr><td><code>minlength</code></td><td><code>number | string</code></td><td>—</td><td>原生 textarea 的 minlength 属性。</td></tr>
<tr><td><code>maxlength</code></td><td><code>number | string</code></td><td>—</td><td>原生 textarea 的 maxlength 属性。</td></tr>
<tr><td><code>wrap</code></td><td><code>&#x27;soft&#x27; | &#x27;hard&#x27;</code></td><td>soft</td><td>原生 textarea 的 wrap 属性。</td></tr>
<tr><td><code>resize</code></td><td><code>&#x27;none&#x27; | &#x27;both&#x27; | &#x27;horizontal&#x27; | &#x27;vertical&#x27;</code></td><td>vertical</td><td>原生 resize 样式，控制可拖拽调整的方向。默认 vertical，只允许垂直拖动。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>输入为空时显示的占位文本，不能替代 label。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方的补充说明。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签，仍保留无障碍名称。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用文本域，内容不可修改，值也不会随表单提交。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>说明禁用原因。设置后，被禁用的文本域仍可聚焦，以便用户查看原因。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>内容只读、不可修改，但值仍会随表单提交。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示，但不会执行浏览器原生的必填校验。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。与 isRequired 同时设置时优先。</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示的显示文字，用于本地化。</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示的显示文字，用于本地化。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度。数字按像素处理，CSS 字符串按原样使用。</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>原生 textarea 的 name 属性，优先于通过原生属性传入的 name。</td></tr>
<tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>原生 form 属性，通过 ID 关联所属表单。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>设置字段的错误、警告或成功校验状态，可附带消息。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27; | &#x27;tooltip&#x27;</code></td><td>detached</td><td>状态消息的展示方式。文本域默认为 detached，消息显示在控件下方。</td></tr>
<tr><td><code>changeAction</code></td><td><code>(value: string, event) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>内容变化后执行的动作。返回 Promise 时，组件会显示加载状态。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>控制加载指示器的显示。</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>在有内容且可编辑时显示清空按钮，点击后清空内容。</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>组件挂载后自动聚焦文本域。</td></tr>
<tr><td><code>clearLabel</code></td><td><code>string</code></td><td>—</td><td>清空按钮的无障碍标签。</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>加载指示器的无障碍标签。</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的装饰图标。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>在标签旁显示信息提示，悬停、键盘聚焦或点击都可以查看。</td></tr>
</tbody></table>
</div>

## 事件

- `update:modelValue(value)`：更新文本内容。
- `change(value, event)`：内容变化时触发。
- `clear(event)`：点击清空按钮时触发。
- `enter(event)`：按 Enter 时触发。Shift + Enter 不触发。
- `keydown(event)`：按键时触发。
- `actionError(error, value, event)`：changeAction 抛出异常时触发。

内容变化时，`update:modelValue` 与 `change` 在 `changeAction` 之前触发。
取消 `change` 事件会阻止 `changeAction` 执行。

## 原生属性

- `class`、`style` 和其他属性应用于字段外层。
- `aria-labelledby` 与 `aria-describedby` 合并到原生 textarea。
- 组件管理 textarea 的 `disabled`、`readonly` 与 `aria-invalid`。
- `icon` 插槽在文本域左侧显示装饰图标。
- `end` 插槽在文本域右侧显示附加内容。
- `labelIcon` 插槽替换标签前的图标。

## 主题

```css
.my-text-area {
  --astryx-text-area-min-height-md: 120px;
}
```

- `--astryx-text-area-min-height-sm`：sm 尺寸最小高度。
- `--astryx-text-area-min-height-md`：md 尺寸最小高度。
- `--astryx-text-area-min-height-lg`：lg 尺寸最小高度。

其他颜色与边框变量与 TextInput 共享。Neutral 自动适配明暗模式。

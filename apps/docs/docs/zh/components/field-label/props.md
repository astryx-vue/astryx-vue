---
layout: component-docs
title: 字段标签
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="FieldLabel 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>标签文字。必填。</td></tr>
<tr><td><code>inputId</code></td><td><code>string</code></td><td>—</td><td>这个标签对应的控件 <code>id</code>。会变成 <code>for</code> 属性，也是生成标签 id 和说明 id 的基础。必填。</td></tr>
<tr><td><code>labelId</code></td><td><code>string</code></td><td><code>`${inputId}-label`</code></td><td>放在标签元素本身的 <code>id</code>。控件不是真正的 <code>label</code> 时，用控件的 <code>aria-labelledby</code> 指向它。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下面那行说明。点它会聚焦控件，除非是分组标签或者已经禁用。</td></tr>
<tr><td><code>descriptionId</code></td><td><code>string</code></td><td><code>`${inputId}-description`</code></td><td>放在说明上的 <code>id</code>。用控件的 <code>aria-describedby</code> 指向它。</td></tr>
<tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把标签渲染成不带 <code>for</code> 的 <code>span</code>，用于一组控件而不是单个输入框。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签在视觉上隐藏，读屏仍然能读到。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签变淡，同时点说明也不会再聚焦控件。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示可选标记。和 <code>isRequired</code> 同时写时以它为准。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示必填标记。放在 <code>defaultOptionality="required"</code> 的 <code>FormLayout</code> 里时不再显示，因为必填就是默认。</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签文字前面的图标，放在 16px 的框里。外层是 <code>aria-hidden</code>，所以图标本身不该单独承载信息。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签行末尾那个提示按钮的文字。</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>'Optional'</code></td><td>可选标记的文字。要本地化就改它。</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>'Required'</code></td><td>必填标记的文字。要本地化就改它。</td></tr>
</tbody></table>
</div>

## 插槽

- `labelIcon`：标签文字前面的图标，位置和 `labelIcon` 属性一样，两个都写时用插槽。

## 暴露

- `element`：渲染出来的标签元素。

---
layout: component-docs
title: 复选列表
outline: false
footer: false
---

## CheckboxList 属性

<div class="component-api-table" role="region" aria-label="CheckboxList 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string[]</code></td><td>—</td><td>已勾选的值。独立行不要传。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。这一组的无障碍名称。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下的说明。</td></tr>
<tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code></td><td>行距。紧凑时用小号复选框。</td></tr>
<tr><td><code>hasDividers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>行与行之间画分隔线。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>错误、警告或成功。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用每一行。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>整组被禁用的原因。和 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，每一行仍可聚焦（带 <code>aria-disabled</code>）。旧名 <code>disabledReason</code> 同样可用。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>整组只读。勾选还在，不变暗，但不能改。和禁用同时设置时按禁用处理。</td></tr>
<tr><td><code>changeAction</code></td><td><code>(values) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>勾选变化之后执行。进行中的那一行显示加载，并且不能再点。</td></tr>
<tr><td><code>containerClass</code></td><td><code>string</code></td><td>—</td><td>加到字段外壳上的 class。横向标签的表单里没有外壳，这时不生效。</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳上的行内样式。落点同 <code>containerClass</code>。</td></tr>
<tr><td><code>controlClass</code></td><td><code>string</code></td><td>—</td><td>加到选项组（<code>role="group"</code>）上的 class，不会落到每一行的复选框上。</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到选项组上的行内样式。</td></tr>
</tbody></table>
</div>

## CheckboxListItem 属性

<div class="component-api-table" role="region" aria-label="CheckboxListItem 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。行标题，也是复选框的名称。需要链接等富内容时用 <code>label</code> 插槽，复选框的名字取可见文字。</td></tr>
<tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>—</td><td>覆盖复选框的无障碍名称。富文本标题没有可读文字时使用。</td></tr>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>集合模式必填。独立行不要传。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>次要文字，同时作为复选框的说明。富内容用 <code>description</code> 插槽，仍然通过 <code>aria-describedby</code> 关联。</td></tr>
<tr><td><code>isChecked</code></td><td><code>boolean | 'indeterminate'</code></td><td>—</td><td>独立行的勾选状态。集合模式忽略它。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一行。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>这一行自己的加载。复选框里显示旋转指示，并且不能切换。</td></tr>
</tbody></table>
</div>

## CheckboxListItem 事件和插槽

独立行通过 `check` 发出下一个布尔值。`label` 和 `description` 插槽放富文本。`end` 插槽画在标题后面。

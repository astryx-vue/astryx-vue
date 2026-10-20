---
layout: component-docs
title: 单选列表
outline: false
footer: false
---

## RadioList 属性

<div class="component-api-table" role="region" aria-label="RadioList 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | number</code></td><td>—</td><td>必填。当前选中的值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。这一组的无障碍名称。</td></tr>
<tr><td><code>options</code></td><td><code>RadioOption[]</code></td><td>—</td><td>纯文本选项。行尾需要内容时改用子项。</td></tr>
<tr><td><code>orientation</code></td><td><code>'vertical' | 'horizontal'</code></td><td><code>'vertical'</code></td><td>纵向排列，或排成一行。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>指示器尺寸，20px 或 24px。单独的 Radio 仍是 18px。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>组标签下的说明。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>错误、警告或成功。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'detached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用整组。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>整组被禁用的原因。和 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，每个选项仍可聚焦（带 <code>aria-disabled</code>），但选不中。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标记为必填。</td></tr>
</tbody></table>
</div>

## RadioListItem 属性

<div class="component-api-table" role="region" aria-label="RadioListItem 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>必填。选中后提交的值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。行标题。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标题下的说明。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一行。</td></tr>
</tbody></table>
</div>

`end` 插槽画在标题后面。纵向列表里它靠行的尾端对齐。

---
layout: component-docs
title: 日期时间输入框
outline: false
footer: false
---

## DateTimeInput 属性

<div class="component-api-table" role="region" aria-label="DateTimeInput 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | null</code></td><td><code>null</code></td><td><code>YYYY-MM-DDTHH:MM</code>。两部分都存在才有值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。这一对字段的无障碍名称。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>日期字段的占位符。</td></tr>
<tr><td><code>hourFormat</code></td><td><code>'12h' | '24h'</code></td><td><code>'12h'</code></td><td>时间的显示格式。模型值仍是 ISO。</td></tr>
<tr><td><code>presentation</code></td><td><code>TimePresentation</code></td><td>—</td><td>传给时间字段。</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>同时清除日期和时间。</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td><code>string</code></td><td>—</td><td>时间部分的 ISO 边界。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>两个字段的高度。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>这一对字段的错误、警告或成功。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>同时禁用两个字段。</td></tr>
</tbody></table>
</div>

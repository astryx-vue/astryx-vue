---
layout: component-docs
title: 日期区间输入框
outline: false
footer: false
---

## DateRangeInput 属性

<div class="component-api-table" role="region" aria-label="DateRangeInput 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>DateRange | null</code></td><td><code>null</code></td><td><code>{ start, end }</code>，ISO 日期。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。无障碍名称。</td></tr>
<tr><td><code>presets</code></td><td><code>{ label, getRange }[]</code></td><td>—</td><td>快捷按钮。<code>getRange</code> 返回区间。</td></tr>
<tr><td><code>monthCount</code></td><td><code>number</code></td><td><code>2</code></td><td>弹出层显示几个月。</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td><code>string</code></td><td>—</td><td>区间外的日期不可选。</td></tr>
<tr><td><code>minRangeSpan</code></td><td><code>number</code></td><td><code>1</code></td><td>最短天数，包含两端。</td></tr>
<tr><td><code>maxRangeSpan</code></td><td><code>number</code></td><td>—</td><td>最长天数，包含两端。</td></tr>
<tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>周日，zh-CN 为周一</td><td>日历的第一列。</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>显示清除按钮。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>选择日期区间</code></td><td>空值文案，跟随语言。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>错误、警告或成功。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用字段。</td></tr>
</tbody></table>
</div>

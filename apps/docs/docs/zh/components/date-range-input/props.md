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
<tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td>—</td><td>并排月份数。传了这项时优先于 monthCount。</td></tr>
<tr><td><code>dateConstraints</code></td><td><code>Array&lt;(date: Date) =&gt; boolean&gt;</code></td><td>—</td><td>任一函数返回 false 时该日期不可选。</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td><code>string</code></td><td>—</td><td>区间外的日期不可选。</td></tr>
<tr><td><code>minRangeSpan</code></td><td><code>number</code></td><td><code>1</code></td><td>最短天数，包含两端。</td></tr>
<tr><td><code>maxRangeSpan</code></td><td><code>number</code></td><td>—</td><td>最长天数，包含两端。</td></tr>
<tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>周日，zh-CN 为周一</td><td>日历的第一列。</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>显示清除按钮。键盘激活清除时，焦点回到触发按钮，并避免页面滚动。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏标签，读屏仍然读得到。旧名 <code>labelHidden</code> 同样可用，两者任一为真就隐藏。演练场里写 <code>is-label-hidden</code>。</td></tr>
<tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到字段外壳的 class。在 InputGroup 和横向标签的 FormLayout 里没有外壳，此时不生效，开发环境会警告。</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳的行内样式。落点规则同 containerClass。</td></tr>
<tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到带边框本体的 class。直接写在组件上的 class 也落在本体，不会落到触发按钮上。</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到带边框本体的行内样式。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>选择日期区间</code></td><td>空值文案，跟随语言。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>错误、警告或成功。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用字段。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。和 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，按钮仍可聚焦（带 <code>aria-disabled</code>），但打不开日历。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>正在保存。字段不可改。</td></tr>
<tr><td><code>changeAction</code></td><td><code>(value) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>区间提交之后再跑。返回 Promise 时保持加载。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>—</td><td>在标签旁标成可选。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>—</td><td>把字段标成必填。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的说明。</td></tr>
</tbody></table>
</div>

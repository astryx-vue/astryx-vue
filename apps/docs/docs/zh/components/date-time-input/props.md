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
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>为什么禁用。和 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，两段都仍可聚焦（带 <code>aria-disabled</code>）。</td></tr>
<tr><td><code>hasSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>时间那段带秒，模型值变成 <code>YYYY-MM-DDTHH:MM:SS</code>。系统时间控件表达不了秒，所以固定用 Astryx 的时间字段。</td></tr>
<tr><td><code>timeIncrement</code></td><td><code>1 | 5 | 10 | 15 | 30</code></td><td><code>1</code></td><td>时间那段方向键调整分钟的步长。不是默认值时固定用 Astryx 的时间字段。</td></tr>
<tr><td><code>timeOptionInterval</code></td><td><code>5 | 10 | 15 | 30 | 60</code></td><td>—</td><td>预设时间的分钟间隔。设置后点时钟图标会按这个间隔列出可选时间，并按 <code>min</code>、<code>max</code> 的时刻裁剪；即使处于系统控件模式也用 Astryx 的时间字段。</td></tr>
<tr><td><code>timeLabel</code></td><td><code>string</code></td><td><code>时间</code></td><td>时间那段的读屏标签。</td></tr>
<tr><td><code>timePlaceholder</code></td><td><code>string</code></td><td><code>选择时间</code></td><td>时间那段没选值时显示的占位文本。</td></tr>
<tr><td><code>dateConstraints</code></td><td><code>Array&lt;(date: Date) =&gt; boolean&gt;</code></td><td>—</td><td>日期那一半里，任一函数返回 false 时该日不可选。</td></tr>
<tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td>—</td><td>日期月历并排的月份数。</td></tr>
<tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>—</td><td>日期月历从哪一天开始一周。</td></tr>
<tr><td><code>nativePicker</code></td><td><code>'touch' | 'always' | 'never'</code></td><td>—</td><td>旧的打开方式，同时传给日期和时间。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>两个字段都不可改。</td></tr>
<tr><td><code>changeAction</code></td><td><code>(value) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>日期和时间都齐了之后再跑。返回 Promise 时保持加载。清除也会跑。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>—</td><td>在标签旁标成可选。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>—</td><td>把这一对字段标成必填。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的说明。</td></tr>
</tbody></table>
</div>

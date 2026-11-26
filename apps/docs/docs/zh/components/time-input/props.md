---
layout: component-docs
title: 时间输入框
outline: false
footer: false
---

## TimeInput 属性

<div class="component-api-table" role="region" aria-label="TimeInput 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string | null</code></td><td><code>null</code></td><td>ISO 时间，<code>HH:MM</code> 或 <code>HH:MM:SS</code>。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。无障碍名称。</td></tr>
<tr><td><code>hourFormat</code></td><td><code>'12h' | '24h'</code></td><td>语言自己的时制</td><td>显示格式。不传就跟随当前语言：<code>en</code> 是 12 小时，<code>en-GB</code>、<code>de-DE</code>、<code>zh-CN</code> 是 24 小时；数字、分隔符和上下午的词也跟着语言走。模型值始终是 24 小时 ISO。</td></tr>
<tr><td><code>hasSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>值里保留秒。</td></tr>
<tr><td><code>increment</code></td><td><code>number</code></td><td><code>1</code></td><td>方向键每次增减的分钟数。步长按整分钟计，写小数时时间保持不变。</td></tr>
<tr><td><code>entryErrorBehavior</code></td><td><code>'complete' | 'blur-or-enter'</code></td><td><code>'complete'</code></td><td>打字被拒什么时候亮出来。一段文字有了小时、两位分钟（显示秒时还有两位秒）、12 小时制还写了上下午（0 点和 13 到 23 点不用写）才算打完整。<code>complete</code> 下，完整却超出 <code>min</code> 或 <code>max</code> 的时间立刻亮出来；<code>blur-or-enter</code> 等到 Enter 或失焦。读不成时间的文字永远等 Enter 或失焦。被拒的文字留在框里，字段显示为什么不收、设置 <code>aria-invalid</code> 并只念一次。Enter 收下打进来的文字，外面的表单照常提交。调用方带说明的 <code>error</code> 状态替字段措辞；警告和成功状态不挡住拒绝。没有 <code>FormLayout</code> 的默认值时是 <code>complete</code>。</td></tr>
<tr><td><code>min</code></td><td><code>string</code></td><td>—</td><td>最早的 ISO 时间。</td></tr>
<tr><td><code>max</code></td><td><code>string</code></td><td>—</td><td>最晚的 ISO 时间。</td></tr>
<tr><td><code>presentation</code></td><td><code>'text-input' | 'native' | 'adaptive-native' | 'adaptive-bottom-sheet' | 'popover' | 'bottom-sheet'</code></td><td><code>'adaptive-native'</code></td><td>文本框、系统时间控件，或底部时分滚轮。不传时细指针用文本框，粗指针用系统控件。adaptive-bottom-sheet 只在粗指针上用滚轮；bottom-sheet 始终用滚轮。有秒、步进不是 1，或设了预设间隔时，系统控件退回文本框，滚轮不受影响。显式值压过 nativePicker。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏标签，读屏仍然读得到。旧名 <code>labelHidden</code> 同样可用，两者任一为真就隐藏。</td></tr>
<tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到字段外壳的 class。在 InputGroup 和横向标签的 FormLayout 里没有外壳，此时不生效，开发环境会警告。</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳的行内样式。落点规则同 containerClass。</td></tr>
<tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到带边框本体的 class。直接写在组件上的 class 也落在本体，不会落到内部输入框上。</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到带边框本体的行内样式。</td></tr>
<tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示清除按钮。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>字段高度。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>错误、警告或成功。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用字段。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。和 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，输入框仍可聚焦（带 <code>aria-disabled</code>），但改不了值。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>字段不可改，并显示加载指示。</td></tr>
<tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>加载中</code></td><td>加载指示的读屏文本。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的说明。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>选择时间</code></td><td>空值文案。聚焦且为空时，改成格式提示。</td></tr>
</tbody></table>
</div>

## TimeInput 事件

<div class="component-api-table" role="region" aria-label="TimeInput 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>value: string | null</code></td><td>时间变化时触发。</td></tr>
<tr><td><code>entryErrorChange</code></td><td><code>error: { kind, text, time? } | null</code></td><td>字段对打进来的文字的拒绝开始、改变或结束时触发，结束时是 <code>null</code>。<code>kind</code> 是 <code>unreadable</code> 或 <code>outOfRange</code>；<code>time</code> 是 <code>outOfRange</code> 时文字指向的 ISO 时间。</td></tr>
</tbody></table>
</div>

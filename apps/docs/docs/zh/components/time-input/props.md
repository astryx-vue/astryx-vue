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
<tr><td><code>hourFormat</code></td><td><code>'12h' | '24h'</code></td><td><code>'12h'</code></td><td>显示格式。模型值始终是 24 小时 ISO。</td></tr>
<tr><td><code>hasSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>值里保留秒。</td></tr>
<tr><td><code>increment</code></td><td><code>number</code></td><td><code>1</code></td><td>方向键每次增减的分钟数。</td></tr>
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

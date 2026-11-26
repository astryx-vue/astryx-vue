---
layout: component-docs
title: 日期输入框
outline: false
footer: false
---

## DateInput Props

<div class="component-api-table" role="region" aria-label="DateInput Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>当前选中的日期。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select a date</code> / <code>选择日期</code></td><td>占位文本。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>min</code></td><td><code>Date</code></td><td>—</td><td>最早可选日期。</td></tr>
      <tr><td><code>max</code></td><td><code>Date</code></td><td>—</td><td>最晚可选日期。</td></tr>
      <tr><td><code>isDateDisabled</code></td><td><code>(date: Date) =&gt; boolean</code></td><td>—</td><td>返回 true 时该日期不可选。</td></tr>
      <tr><td><code>dateConstraints</code></td><td><code>Array&lt;(date: Date) =&gt; boolean&gt;</code></td><td>—</td><td>任一函数返回 false 时该日期不可选。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>字段标签。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签只留给读屏，页面上不显示。旧名 <code>labelHidden</code> 同样可用，两者任一为真就隐藏。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>—</td><td>在标签旁标成可选。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>—</td><td>把字段标成必填，输入框带上 aria-required。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的说明。</td></tr>
      <tr><td><code>format</code></td><td><code>'date' | 'date_long' | 'date_weekday' | 'system_date' | ((iso: string) =&gt; string)</code></td><td><code>'date_long'</code></td><td>已提交日期的显示方式。函数收到的是 <code>YYYY-MM-DD</code>。</td></tr>
      <tr><td><code>presentation</code></td><td><code>'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'</code></td><td>未设置时为 adaptive-native</td><td>弹出层、底部面板、系统日期控件，或按指针在它们之间切换。同时传了 nativePicker 时以这项为准。</td></tr>
      <tr><td><code>nativePicker</code></td><td><code>'touch' | 'always' | 'never'</code></td><td>—</td><td>旧的打开方式。touch 跟随指针，always 用系统控件，never 按指针在弹出层和底部面板之间切换。同时传了 presentation 时以 presentation 为准。</td></tr>
      <tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td><code>1</code></td><td>弹出日历并排的月份数。系统日期控件表达不了这项。</td></tr>
      <tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>—</td><td>弹出日历从哪一天开始一周。系统日期控件表达不了这项。</td></tr>
      <tr><td><code>calendar</code></td><td><code>CalendarSystem</code></td><td>跟随 provider</td><td>按哪种历法显示、读取和选择日期，例如 <code>'persian'</code>。不传时跟随最近的 <code>InternationalizationProvider</code>，都没有时是公历。可以按这个历法打字；非公历下系统日期控件换成 Astryx 的选择器。值始终是公历日期。见<a href="/guide/calendars">历法</a>。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。输入框和日历按钮仍可聚焦并带 <code>aria-disabled</code>，但不能输入或打开日历。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>加载中。字段仍可聚焦，通过 <code>aria-busy</code> 和加载指示表示忙碌；加载结束前不能输入、选择或清除日期。进入忙碌时播报一次。</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value: Date | null) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>值提交之后再跑。返回 Promise 时，字段保持加载直到它结束。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整段字段的宽度。数字按像素算。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。和 <code>disabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，输入框仍可聚焦（带 <code>aria-disabled</code>），但改不了值。旧名 <code>disabledReason</code> 同样可用。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>有值时显示清除按钮，清空后焦点回到输入框。旧名 <code>clearable</code> 同样可用。</td></tr>
      <tr><td><code>clearLabel</code></td><td><code>string</code></td><td><code>Clear</code> / <code>清除</code></td><td>清除按钮的无障碍名称。设置了 <code>label</code> 时会带上它。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success' | { type, message? }</code></td><td>—</td><td>校验状态。对象带 <code>message</code> 时，说明会显示在字段下方。</td></tr>
      <tr><td><code>entryErrorBehavior</code></td><td><code>'complete' | 'blur-or-enter'</code></td><td><code>'complete'</code></td><td>被拒的输入什么时候亮出来。<code>complete</code>：打成一个完整、但超出范围或不存在的日子时立刻亮，读不成日期的文字等 Enter 或失焦；<code>blur-or-enter</code>：打字时什么都不亮。不传时用最近 FormLayout 的 <code>defaultEntryErrorBehavior</code>。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态说明的位置。</td></tr>
      <tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到字段外壳的 class。在 InputGroup 和横向标签的 FormLayout 里没有外壳，此时不生效，开发环境会警告。</td></tr>
      <tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳的行内样式。落点规则同 containerClass。</td></tr>
      <tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到带边框本体的 class。直接写在组件上的 class 也落在本体，不会落到内部输入框上。</td></tr>
      <tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到带边框本体的行内样式。</td></tr>
    </tbody>
  </table>
</div>

## DateInput 事件

<div class="component-api-table" role="region" aria-label="DateInput 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: Date | null</code></td><td>日期变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: Date | null</code></td><td>日期变化时触发。</td></tr>
      <tr><td><code>entryErrorChange</code></td><td><code>error: { kind, text, date? } | null</code></td><td>字段对打进来的文字的拒绝开始、改变或结束（<code>null</code>）时触发。<code>kind</code> 是 <code>unreadable</code>、<code>incomplete</code>、<code>nonexistent</code>、<code>outOfRange</code> 或 <code>unavailable</code>，后两种带 ISO 日期 <code>date</code>。监听了它时，<code>status</code> 里带说明的 error 替字段措辞。</td></tr>
    </tbody>
  </table>
</div>

## DateInput 插槽

<div class="component-api-table" role="region" aria-label="DateInput 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>prefix</code></td><td>输入框前面的图标。</td></tr>
      <tr><td><code>suffix</code></td><td>输入框后面的内容。</td></tr>
    </tbody>
  </table>
</div>

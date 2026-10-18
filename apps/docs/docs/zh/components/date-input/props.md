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
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签只留给读屏，页面上不显示。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>—</td><td>在标签旁标成可选。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>—</td><td>把字段标成必填，输入框带上 aria-required。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的说明。</td></tr>
      <tr><td><code>format</code></td><td><code>'date' | 'date_long' | 'date_weekday' | 'system_date' | ((iso: string) =&gt; string)</code></td><td><code>'date_long'</code></td><td>已提交日期的显示方式。函数收到的是 <code>YYYY-MM-DD</code>。</td></tr>
      <tr><td><code>presentation</code></td><td><code>'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'</code></td><td>未设置时为 adaptive-native</td><td>弹出层、底部面板、系统日期控件，或按指针在它们之间切换。同时传了 nativePicker 时以这项为准。</td></tr>
      <tr><td><code>nativePicker</code></td><td><code>'touch' | 'always' | 'never'</code></td><td>—</td><td>旧的打开方式。touch 跟随指针，always 用系统控件，never 用日历。</td></tr>
      <tr><td><code>numberOfMonths</code></td><td><code>1 | 2</code></td><td><code>1</code></td><td>弹出日历并排的月份数。系统日期控件表达不了这项。</td></tr>
      <tr><td><code>weekStartsOn</code></td><td><code>0-6 | 'sun' | 'mon' | ...</code></td><td>—</td><td>弹出日历从哪一天开始一周。系统日期控件表达不了这项。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>字段不可改，并显示加载指示。</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value: Date | null) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>值提交之后再跑。返回 Promise 时，字段保持加载直到它结束。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整段字段的宽度。数字按像素算。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。和 <code>disabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，输入框仍可聚焦（带 <code>aria-disabled</code>），但改不了值。旧名 <code>disabledReason</code> 同样可用。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>有值时显示清除按钮，清空后焦点回到输入框。旧名 <code>clearable</code> 同样可用。</td></tr>
      <tr><td><code>clearLabel</code></td><td><code>string</code></td><td><code>Clear</code> / <code>清除</code></td><td>清除按钮的无障碍名称。设置了 <code>label</code> 时会带上它。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success' | { type, message? }</code></td><td>—</td><td>校验状态。对象带 <code>message</code> 时，说明会显示在字段下方。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态说明的位置。</td></tr>
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

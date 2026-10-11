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
      <tr><td><code>modelValue</code></td><td><code>CalendarDate | null</code></td><td><code>null</code></td><td>选中的日期。</td></tr>
      <tr><td><code>format</code></td><td><code>string</code></td><td><code>'YYYY-MM-DD'</code></td><td>日期显示格式。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'请选择日期'</code></td><td>占位符文本。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否可清除。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只读。</td></tr>
      <tr><td><code>minValue</code></td><td><code>CalendarDate</code></td><td>—</td><td>最小可选日期。</td></tr>
      <tr><td><code>maxValue</code></td><td><code>CalendarDate</code></td><td>—</td><td>最大可选日期。</td></tr>
      <tr><td><code>isDateUnavailable</code></td><td><code>(date: CalendarDate) => boolean</code></td><td>—</td><td>判断日期是否不可选。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
    </tbody>
  </table>
</div>

## DateInput Emits

<div class="component-api-table" role="region" aria-label="DateInput Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>date: CalendarDate | null</code></td><td>日期变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>date: CalendarDate | null</code></td><td>日期变化时触发。</td></tr>
      <tr><td><code>clear</code></td><td>—</td><td>清除日期时触发。</td></tr>
    </tbody>
  </table>
</div>

## DateInput Slots

<div class="component-api-table" role="region" aria-label="DateInput Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>prepend</code></td><td>输入框前置内容。</td></tr>
      <tr><td><code>append</code></td><td>输入框后置内容。</td></tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: 日历
outline: false
footer: false
---

## Calendar Props

<div class="component-api-table" role="region" aria-label="Calendar Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>CalendarDate | null</code></td><td><code>null</code></td><td>选中的日期。</td></tr>
      <tr><td><code>defaultValue</code></td><td><code>CalendarDate</code></td><td>—</td><td>默认展示的月份。</td></tr>
      <tr><td><code>minValue</code></td><td><code>CalendarDate</code></td><td>—</td><td>最小可选日期。</td></tr>
      <tr><td><code>maxValue</code></td><td><code>CalendarDate</code></td><td>—</td><td>最大可选日期。</td></tr>
      <tr><td><code>isDateUnavailable</code></td><td><code>(date: CalendarDate) => boolean</code></td><td>—</td><td>判断日期是否不可选。</td></tr>
      <tr><td><code>locale</code></td><td><code>string</code></td><td><code>'zh-CN'</code></td><td>地区代码。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只读。</td></tr>
    </tbody>
  </table>
</div>

## Calendar Emits

<div class="component-api-table" role="region" aria-label="Calendar Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>date: CalendarDate | null</code></td><td>日期变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>date: CalendarDate | null</code></td><td>日期变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## Calendar Slots

<div class="component-api-table" role="region" aria-label="Calendar Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>header</code></td><td><code>{ month: string, year: number }</code></td><td>自定义头部。</td></tr>
      <tr><td><code>day</code></td><td><code>{ date: CalendarDate, isSelected: boolean, isDisabled: boolean }</code></td><td>自定义日期单元格。</td></tr>
    </tbody>
  </table>
</div>

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
      <tr><td><code>modelValue</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>当前选中的日期。</td></tr>
      <tr><td><code>min</code></td><td><code>Date</code></td><td>—</td><td>最早可选日期。</td></tr>
      <tr><td><code>max</code></td><td><code>Date</code></td><td>—</td><td>最晚可选日期。</td></tr>
      <tr><td><code>isDateDisabled</code></td><td><code>(date: Date) =&gt; boolean</code></td><td>—</td><td>返回 true 时该日期不可选。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td><code>'日历'</code></td><td>日历的无障碍名称。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用整个日历。</td></tr>
    </tbody>
  </table>
</div>

## Calendar 事件

<div class="component-api-table" role="region" aria-label="Calendar 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: Date | null</code></td><td>选中日期变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: Date | null</code></td><td>选中日期变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## Calendar 插槽

<div class="component-api-table" role="region" aria-label="Calendar 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>header</code></td><td>—</td><td>自定义月份头部。</td></tr>
      <tr><td><code>day</code></td><td><code>{ date, isSelected, isDisabled, isToday, isInMonth }</code></td><td>自定义日期单元格。</td></tr>
    </tbody>
  </table>
</div>

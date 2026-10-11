---
layout: component-docs
title: 数字输入框
outline: false
footer: false
---

## NumberInput Props

<div class="component-api-table" role="region" aria-label="NumberInput Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>number</code></td><td><code>0</code></td><td>当前值。</td></tr>
      <tr><td><code>min</code></td><td><code>number</code></td><td><code>-Infinity</code></td><td>最小值。</td></tr>
      <tr><td><code>max</code></td><td><code>number</code></td><td><code>Infinity</code></td><td>最大值。</td></tr>
      <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>步长。</td></tr>
      <tr><td><code>precision</code></td><td><code>number</code></td><td>—</td><td>小数位数。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只读。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>占位符。</td></tr>
    </tbody>
  </table>
</div>

## NumberInput Emits

<div class="component-api-table" role="region" aria-label="NumberInput Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: number</code></td><td>值变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: number</code></td><td>值变化时触发。</td></tr>
      <tr><td><code>blur</code></td><td><code>event: FocusEvent</code></td><td>失去焦点时触发。</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>获得焦点时触发。</td></tr>
    </tbody>
  </table>
</div>

## NumberInput Slots

<div class="component-api-table" role="region" aria-label="NumberInput Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>prepend</code></td><td>输入框前置内容。</td></tr>
      <tr><td><code>append</code></td><td>输入框后置内容。</td></tr>
    </tbody>
  </table>
</div>

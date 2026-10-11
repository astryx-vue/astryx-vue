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
      <tr><td><code>modelValue</code></td><td><code>number | null</code></td><td><code>null</code></td><td>当前值。</td></tr>
      <tr><td><code>min</code></td><td><code>number</code></td><td>—</td><td>最小值。</td></tr>
      <tr><td><code>max</code></td><td><code>number</code></td><td>—</td><td>最大值。</td></tr>
      <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>每次增减的步长。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>禁用原因，悬停时显示。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>占位文本。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>字段标签，同时作为无障碍名称。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。</td></tr>
    </tbody>
  </table>
</div>

## NumberInput 事件

<div class="component-api-table" role="region" aria-label="NumberInput 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: number | null</code></td><td>值变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: number | null</code></td><td>值变化时触发。</td></tr>
    </tbody>
  </table>
</div>

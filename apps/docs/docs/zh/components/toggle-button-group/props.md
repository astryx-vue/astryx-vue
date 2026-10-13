---
layout: component-docs
title: 切换按钮组
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>无障碍名称，写到 <code>aria-label</code> 上。</td></tr>
      <tr><td><code>type</code></td><td><code>'single' | 'multiple'</code></td><td><code>'single'</code></td><td><code>single</code> 同时只按下一个。<code>multiple</code> 各自按下。</td></tr>
      <tr><td><code>value</code></td><td><code>string | null | string[]</code></td><td><code>null</code></td><td>按下的那一个，或多选时的列表。用 <code>v-model:value</code> 绑定。</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>排列方向。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>成员继承的尺寸。成员自己的 <code>size</code> 优先。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用全部成员。成员仍可以单独禁用自己。</td></tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:value</code></td><td><code>string | null | string[]</code></td><td>下一次的选择。</td></tr>
      <tr><td><code>change</code></td><td><code>string | null | string[]</code></td><td>和 <code>update:value</code> 一起发出。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

默认插槽是 `ToggleButton`。参与选择的按钮都要有 `value`。

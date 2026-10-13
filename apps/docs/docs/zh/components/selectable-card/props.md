---
layout: component-docs
title: 可选卡片
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SelectableCard Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>隐藏复选框的无障碍名称。</td></tr>
      <tr><td><code>isSelected</code></td><td><code>boolean</code></td><td>-</td><td>是否选中。用 <code>v-model:isSelected</code> 绑定。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>卡片不再响应激活。</td></tr>
      <tr><td><code>variant</code></td><td><code>CardVariant</code></td><td><code>'default'</code></td><td>背景变体。选中后的描边用这个色相。</td></tr>
      <tr><td><code>elevation</code></td><td><code>CardElevation</code></td><td><code>'none'</code></td><td>静止阴影。选中描边和它叠在一起。</td></tr>
      <tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>-</td><td>传给 <code>Card</code> 的内边距。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>宽度。数字按像素。</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td>-</td><td>高度。数字按像素。</td></tr>
      <tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>-</td><td>最大宽度。</td></tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="SelectableCard Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:isSelected</code></td><td><code>boolean</code></td><td>下一次的选中状态。</td></tr>
      <tr><td><code>change</code></td><td><code>boolean</code></td><td>和 <code>update:isSelected</code> 一起发出。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

默认插槽是卡片内容。里面的按钮和链接仍走自己的点击。

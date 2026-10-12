---
layout: component-docs
title: 可点击卡片
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ClickableCard Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>隐藏控件的无障碍名称。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>卡片要去的地址。不传时改由 <code>click</code> 处理。</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>-</td><td><code>href</code> 的浏览上下文。<code>_blank</code> 打开新标签页。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>卡片不再响应激活。</td></tr>
      <tr><td><code>variant</code></td><td><code>CardVariant</code></td><td><code>'default'</code></td><td>背景变体，传给 <code>Card</code>。</td></tr>
      <tr><td><code>elevation</code></td><td><code>CardElevation</code></td><td><code>'none'</code></td><td>静止阴影：none、low、med、high。</td></tr>
      <tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>-</td><td>传给 <code>Card</code> 的内边距。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>宽度。数字按像素。</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td>-</td><td>高度。数字按像素。</td></tr>
      <tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>-</td><td>最大宽度。</td></tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ClickableCard Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>卡片表面被激活。里面的控件不会发出这个事件。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

默认插槽是卡片内容。

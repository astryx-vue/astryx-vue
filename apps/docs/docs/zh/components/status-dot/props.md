---
layout: component-docs
title: 状态点
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="StatusDot Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>StatusDotVariant</code></td>
        <td><code>'neutral'</code></td>
        <td>状态点的语义颜色变体，可选 neutral、info、success、warning、error。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>状态的无障碍标签，必填。会作为 <code>aria-label</code> 供屏幕阅读器读取。</td>
      </tr>
      <tr>
        <td><code>isPulsing</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否显示脉冲动画，开启后状态点会呼吸闪烁，用于提示正在进行中的活动。</td>
      </tr>
      <tr>
        <td><code>tooltip</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>悬停和键盘聚焦时显示的提示文字，需要一句话解释状态时用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="StatusDot 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>画在圆点正中的图标，用变体的前景色。每种状态用不同图标，这样不靠颜色也能分辨。对读屏隐藏，读屏读的是 <code>label</code>。</td>
      </tr>
    </tbody>
  </table>
</div>



## 原生属性

根元素为 `<span>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

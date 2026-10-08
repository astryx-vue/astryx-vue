---
layout: component-docs
title: 骨架屏
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Skeleton Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td><code>'100%'</code></td><td>占位块的宽度。传入数字时按像素处理，字符串则保留为 CSS 尺寸。</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td><code>'100%'</code></td><td>占位块的高度。传入数字时按像素处理，字符串则保留为 CSS 尺寸。</td></tr>
      <tr><td><code>radius</code></td><td><code>'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'</code></td><td><code>3</code></td><td>圆角使用设计令牌等级，<code>none</code> 为直角，<code>rounded</code> 为完全圆角。</td></tr>
      <tr><td><code>index</code></td><td><code>number</code></td><td><code>0</code></td><td>交错动画的索引，每增加 1，动画延后 100ms，让多个占位块依次闪烁。</td></tr>
    </tbody>
  </table>
</div>

## 无障碍

- `Skeleton` 默认设置 `aria-hidden="true"`。
- 辅助技术不会读取默认的占位块。
- 外围加载区域必须提供名称。
- 外围加载区域必须设置 `aria-busy="true"`。
- 系统启用「减少动态效果」时，脉冲动画停止。
- 系统启用强制颜色模式时，占位块保持可见。

## 原生属性

根元素为 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

传入 `aria-hidden` 时，该值覆盖默认值。

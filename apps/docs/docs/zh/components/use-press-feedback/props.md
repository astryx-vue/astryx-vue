---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

## 参数

这个组合式函数不接收参数。

## 返回值

<div class="component-api-table" role="region" aria-label="usePressFeedback 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pressableProps</code></td>
        <td><code>Record&lt;string, string&gt;</code></td>
        <td>铺到「背景画按压」的元素上的标记属性（<code>data-astryx-pressable</code>）。这个函数带上的样式会在按压成立的第一帧画出 <code>--astryx-color-overlay-pressed</code>，松手时淡出，鼠标仍然走 <code>:active</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

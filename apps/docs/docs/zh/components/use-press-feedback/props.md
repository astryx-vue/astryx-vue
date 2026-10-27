---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="usePressFeedback 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.hasOverlay</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>要不要带上默认的按压色（<code>astryx-pressable</code> 类，在 <code>::after</code> 上画一层）。组件自己在样式里读 <code>--_press-paint-image</code> 画按压时传 false，只拿标记。</td>
      </tr>
    </tbody>
  </table>
</div>

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
        <td>用 <code>v-bind</code> 铺到「画按压」的元素上：标记属性 <code>data-astryx-pressable</code>，默认还有 <code>class: 'astryx-pressable'</code>。手指按压成立时控制器在元素上写 <code>data-astryx-press="on"</code>，抬手淡出时写 <code>"fading"</code>。默认样式在按压成立的第一帧画出 <code>--astryx-color-overlay-pressed</code>，抬手后 200 毫秒淡出，鼠标仍然走 <code>:active</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useLongPress
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useLongPress 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>LongPressOptions</code></td>
        <td>—</td>
        <td>配置对象。必填。</td>
      </tr>
      <tr>
        <td><code>options.onLongPress</code></td>
        <td><code>(point: { x: number, y: number }) =&gt; void</code></td>
        <td>—</td>
        <td>按满 <code>delayMs</code> 之后触发，参数是按下时的坐标。必填。</td>
      </tr>
      <tr>
        <td><code>options.isDisabled</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>—</td>
        <td>一个 getter，每次 <code>start</code> 时读。返回 true 时这次不检测，所以被禁用的触发器只要改这个布尔值，不用重新注册。必填。</td>
      </tr>
      <tr>
        <td><code>options.delayMs</code></td>
        <td><code>number</code></td>
        <td><code>500</code></td>
        <td>要按住多少毫秒才算长按。</td>
      </tr>
      <tr>
        <td><code>options.moveCancelPx</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>任一轴上移动超过这个距离就取消，当作滚动或拖拽。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useLongPress 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>start</code></td>
        <td><code>(point: { x: number, y: number }) =&gt; void</code></td>
        <td>从一个坐标开始检测。在 <code>pointerdown</code> 里调。它会先清掉上一次没完成的按住，再重新计时。</td>
      </tr>
      <tr>
        <td><code>moveTo</code></td>
        <td><code>(point: { x: number, y: number }) =&gt; boolean</code></td>
        <td>报告指针的新位置。还在容差内返回 true；超出去就取消这次按住并返回 false。没有正在进行的按住时也返回 false。</td>
      </tr>
      <tr>
        <td><code>cancel</code></td>
        <td><code>() =&gt; void</code></td>
        <td>丢掉还没完成的按住。绑在 <code>pointerup</code> 和 <code>pointercancel</code> 上。组件卸载时也会执行。</td>
      </tr>
    </tbody>
  </table>
</div>

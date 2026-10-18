---
layout: component-docs
title: useEntryAnimation
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useEntryAnimation 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>preset</code></td>
        <td><code>'slideDown' | 'slideUp' | 'fadeIn' | 'scaleIn'</code></td>
        <td><code>'slideDown'</code></td>
        <td>挂载时播放的动画。<code>slideDown</code> 从上方落下来，<code>slideUp</code> 从下方升上来，<code>fadeIn</code> 只淡入，<code>scaleIn</code> 一边放大一边淡入。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useEntryAnimation 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>entryClass</code></td>
        <td><code>string | null</code></td>
        <td>入场动画用的共享 class；元素是在首屏渲染出来的（不需要动画）时为 <code>null</code>。取值是 <code>astryx-motion-slide-in-below</code>、<code>astryx-motion-slide-in-above</code>、<code>astryx-motion-fade-in</code>、<code>astryx-motion-scale-in</code> 之一。</td>
      </tr>
    </tbody>
  </table>
</div>

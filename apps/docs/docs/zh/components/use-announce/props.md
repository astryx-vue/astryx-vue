---
layout: component-docs
title: useAnnounce
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useAnnounce 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.hasReplace</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>这个播报者的新消息会收回它自己上一条还没念出去的消息，不管两条紧迫度是否相同；新消息写进它自己紧迫度的区域。别的播报者的消息照样连在一起。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useAnnounce 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>announce</code></td>
        <td><code>(message: string, politeness?: 'polite' | 'assertive') =&gt; void</code></td>
        <td>通过共享的 live region 念一句话。第二项默认是 <code>polite</code>；同一帧里播报的消息按顺序连成一条念，一模一样的重复只留一条；传空字符串表示清空残留的状态（包括连在一起还没念的消息），不播报。</td>
      </tr>
    </tbody>
  </table>
</div>

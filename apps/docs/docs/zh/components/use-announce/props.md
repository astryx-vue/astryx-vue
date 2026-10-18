---
layout: component-docs
title: useAnnounce
outline: false
footer: false
---

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
        <td>通过共享的 live region 念一句话。第二项默认是 <code>polite</code>；传空字符串表示清空残留的状态，不播报。</td>
      </tr>
    </tbody>
  </table>
</div>

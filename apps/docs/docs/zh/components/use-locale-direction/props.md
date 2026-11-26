---
layout: component-docs
title: useLocaleDirection
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useLocaleDirection 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>direction</code></td>
        <td><code>ComputedRef&lt;'ltr' | 'rtl'&gt;</code></td>
        <td>最近的 provider 的书写方向：有 <code>dir</code> 用它，否则按它的语言推导。没有 provider 时按默认语言推导，是 <code>'ltr'</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

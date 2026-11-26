---
layout: component-docs
title: useLocale
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useLocale 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>locale</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>最近的 <code>InternationalizationProvider</code> 的 BCP 47 语言标签。没有 provider 时是 <code>'en'</code>。</td>
      </tr>
      <tr>
        <td><code>calendar</code></td>
        <td><code>ComputedRef&lt;CalendarSystem&gt;</code></td>
        <td>最近的 <code>InternationalizationProvider</code> 选的历法，例如 <code>'persian'</code>。没有 provider 或没设 <code>calendar</code> 时是 <code>'gregory'</code>；不认识或当前环境显示不了的历法也读作 <code>'gregory'</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

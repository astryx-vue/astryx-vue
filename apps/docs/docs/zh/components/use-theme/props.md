---
layout: component-docs
title: useTheme
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useTheme 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>name</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>最近一层主题的名字。没有 <code>Theme</code> 时是 <code>neutral</code>。</td>
      </tr>
      <tr>
        <td><code>mode</code></td>
        <td><code>ComputedRef&lt;'light' | 'dark'&gt;</code></td>
        <td>实际生效的颜色模式。<code>system</code> 已经解析成 <code>light</code> 或 <code>dark</code>。</td>
      </tr>
      <tr>
        <td><code>token</code></td>
        <td><code>(name: string) =&gt; string</code></td>
        <td>按当前模式把一个设计 token 解析成实际的 CSS 值。不在 <code>Theme</code> 里时，读的是文档根元素上的自定义属性。</td>
      </tr>
      <tr>
        <td><code>tokens</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, string&gt;&gt;</code></td>
        <td>最近一层主题声明的 token，按当前模式解析后的结果。<code>[浅色, 深色]</code> 会收成一个值。主题或模式不变时结果是稳定的。</td>
      </tr>
    </tbody>
  </table>
</div>

token 名两种写法都可以：<code>--color-accent</code> 或 <code>--astryx-color-accent</code>。

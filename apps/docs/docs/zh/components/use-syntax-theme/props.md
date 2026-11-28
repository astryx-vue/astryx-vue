---
layout: component-docs
title: useSyntaxTheme
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useSyntaxTheme 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>name</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>最近一层 <code>SyntaxTheme</code> 的语法主题名。</td>
      </tr>
      <tr>
        <td><code>mode</code></td>
        <td><code>ComputedRef&lt;'light' | 'dark'&gt;</code></td>
        <td>解析令牌用的模式：最近一层 <code>Theme</code> 的有效模式。</td>
      </tr>
      <tr>
        <td><code>token</code></td>
        <td><code>(name: SyntaxTokenKey) =&gt; string</code></td>
        <td>当前模式下某个语法令牌的 CSS 颜色，比如 <code>keyword</code>。</td>
      </tr>
      <tr>
        <td><code>tokens</code></td>
        <td><code>ComputedRef&lt;SyntaxThemeTokens | null&gt;</code></td>
        <td>当前模式下解析好的全部语法令牌。</td>
      </tr>
    </tbody>
  </table>
</div>

上面没有语法主题时，hook 本身返回 <code>null</code>。

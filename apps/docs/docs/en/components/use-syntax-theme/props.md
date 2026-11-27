---
layout: component-docs
title: useSyntaxTheme
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useSyntaxTheme returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>name</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>Name of the syntax theme from the nearest <code>SyntaxTheme</code>.</td>
      </tr>
      <tr>
        <td><code>mode</code></td>
        <td><code>ComputedRef&lt;'light' | 'dark'&gt;</code></td>
        <td>The mode used to resolve tokens: the nearest <code>Theme</code>'s effective mode.</td>
      </tr>
      <tr>
        <td><code>token</code></td>
        <td><code>(name: SyntaxTokenKey) =&gt; string</code></td>
        <td>The CSS color for one syntax token in the current mode, such as <code>keyword</code>.</td>
      </tr>
      <tr>
        <td><code>tokens</code></td>
        <td><code>ComputedRef&lt;SyntaxThemeTokens | null&gt;</code></td>
        <td>Every syntax token resolved for the current mode.</td>
      </tr>
    </tbody>
  </table>
</div>

The hook itself returns <code>null</code> when no syntax theme is above it.

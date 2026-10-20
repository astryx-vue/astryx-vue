---
layout: component-docs
title: useTheme
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useTheme returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>name</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>Name of the nearest theme, or <code>neutral</code> when no <code>Theme</code> is present.</td>
      </tr>
      <tr>
        <td><code>mode</code></td>
        <td><code>ComputedRef&lt;'light' | 'dark'&gt;</code></td>
        <td>Resolved effective color mode. <code>system</code> is resolved to <code>light</code> or <code>dark</code>.</td>
      </tr>
      <tr>
        <td><code>token</code></td>
        <td><code>(name: string) =&gt; string</code></td>
        <td>Resolve a single design token to its current CSS value for the effective mode. Outside a <code>Theme</code>, it reads the document's custom properties.</td>
      </tr>
      <tr>
        <td><code>tokens</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, string&gt;&gt;</code></td>
        <td>Tokens declared by the nearest theme, resolved for the effective mode. A <code>[light, dark]</code> tuple becomes one value. Stable until the active theme or mode changes.</td>
      </tr>
    </tbody>
  </table>
</div>

Token names may be written either way: <code>--color-accent</code> or <code>--astryx-color-accent</code>.

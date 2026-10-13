---
layout: component-docs
title: 媒体主题
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="MediaTheme 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mode</code></td>
        <td><code>'dark' | 'light' | 'auto' | 'off'</code></td>
        <td>—</td>
        <td>表面明暗。<code>auto</code> 测量父元素。<code>off</code> 保持周围的主题。</td>
      </tr>
      <tr>
        <td><code>fallback</code></td>
        <td><code>'dark' | 'light'</code></td>
        <td><code>'dark'</code></td>
        <td><code>auto</code> 在量到之前、以及量不到时使用的一边。其他模式忽略。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="MediaTheme 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>按表面颜色渲染的内容。</td></tr>
    </tbody>
  </table>
</div>

## useMediaTheme

| 字段 | 说明 |
| --- | --- |
| <code>mode</code> | 解析后的 <code>dark</code>、<code>light</code> 或 <code>off</code>。不在 MediaTheme 里时是 <code>off</code>。 |

## 模板引用

组件暴露 `element`，类型是 `HTMLElement | null`。

## 原生属性

根节点是 `display: contents` 的 `div`。`class` 和 `style` 会写到它上面。其他属性不转发。

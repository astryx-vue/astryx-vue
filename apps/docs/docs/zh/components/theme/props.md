---
layout: component-docs
title: 主题
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Theme 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>theme</code></td>
        <td><code>ThemeDefinition</code></td>
        <td>—</td>
        <td><code>defineTheme()</code> 返回的主题。</td>
      </tr>
      <tr>
        <td><code>mode</code></td>
        <td><code>'light' | 'dark' | 'system'</code></td>
        <td><code>'system'</code></td>
        <td>颜色模式。<code>system</code> 跟随页面和系统。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Theme 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>继承这套主题的内容。</td></tr>
    </tbody>
  </table>
</div>

## defineTheme

| 字段 | 说明 |
| --- | --- |
| <code>name</code> | 主题名，写到 <code>data-astryx-theme</code>。 |
| <code>tokens</code> | 语义 token。二元组先写浅色，再写深色。 |
| <code>extends</code> | 另一份 <code>defineTheme()</code> 主题。当前这份的值优先。 |
| <code>syntax</code> | 子树里代码的语法色。更近的 <code>SyntaxTheme</code> 优先。 |
| <code>onDark</code> | 深色 <code>MediaTheme</code> 表面上的额外 token。 |
| <code>onLight</code> | 浅色 <code>MediaTheme</code> 表面上的额外 token。 |

## useTheme

`useTheme()` 读取最近的主题。不在 `Theme` 里时，名字是 `neutral`，`token()` 读文档上的 CSS 变量。

| 字段 | 说明 |
| --- | --- |
| <code>name</code> | 最近的主题名。 |
| <code>mode</code> | 解析后的 <code>light</code> 或 <code>dark</code>。<code>system</code> 会被解析掉。 |
| <code>token(name)</code> | 当前模式下的一个 token。 |
| <code>tokens</code> | 最近这份主题声明过的 token，按当前模式解析。 |

## 模板引用

组件暴露 `element`，类型是 `HTMLElement | null`。

## 原生属性

根节点是 `display: contents` 的 `div`。`class` 和 `style` 会写到它上面。其他属性不转发。

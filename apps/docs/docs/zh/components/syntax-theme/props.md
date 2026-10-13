---
layout: component-docs
title: 语法主题
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SyntaxTheme 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>theme</code></td>
        <td><code>SyntaxThemeDefinition</code></td>
        <td>—</td>
        <td>内置预设，或 <code>defineSyntaxTheme()</code> 返回的主题。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="SyntaxTheme 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>继承这些颜色的代码组件。</td></tr>
    </tbody>
  </table>
</div>

## Token

`keyword`、`string`、`comment`、`number`、`function`、`type`、`variable`、`operator`、`constant`、`tag`、`attribute`、`property`、`punctuation`、`background`。

## useSyntaxTheme

附近没有 `SyntaxTheme`，主题上也没有 `syntax` 时，返回 `null`。

| 字段 | 说明 |
| --- | --- |
| <code>name</code> | 语法主题名。 |
| <code>mode</code> | 用来挑选 <code>light-dark()</code> 哪一边的模式。 |
| <code>token(name)</code> | 该模式下的一个语法 token。 |
| <code>tokens</code> | 该模式下的全部语法 token。 |

## 原生属性

根节点是 `div`。`class` 和 `style` 会写到它上面。

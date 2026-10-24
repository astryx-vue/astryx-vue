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
| <code>tokens</code> | 语义 token。二元组先写浅色，再写深色。同名时盖过生成结果。 |
| <code>localTokens</code> | 只有这一套主题用的值，键是完整的 CSS 变量名，原样保存。不能用共享 token 的名字。 |
| <code>color</code> | 用强调色生成调色板。accent 可省略，只改中性色。 |
| <code>typography</code> | 字体，以及从 base、ratio 生成的字号。 |
| <code>radius</code> | 从 base 和 multiplier 生成圆角。 |
| <code>motion</code> | 从 fast、medium、slow 和 ratio 生成时长。 |
| <code>components</code> | 按换肤挂点覆盖样式，挂点写成 <code>组件名-部位</code>。编译结果在主题对象的 <code>css</code> 上。 |
| <code>adaptations</code> | 按屏幕宽度、指针、对比度或减弱动效生效的规则，按顺序排，后面满足的赢。 |
| <code>extends</code> | 另一份 <code>defineTheme()</code> 主题。它算好的东西全部带过来，当前这份的值优先。 |
| <code>syntax</code> | 子树里代码的语法色。更近的 <code>SyntaxTheme</code> 优先。 |
| <code>onDark</code> | 深色 <code>MediaTheme</code> 表面上的额外 token 和组件样式。 |
| <code>onLight</code> | 浅色 <code>MediaTheme</code> 表面上的额外 token 和组件样式。 |
| <code>icons</code> | 语义图标名到 Iconify id。按名字覆盖，和被扩展的主题浅合并。 |
| <code>indicators</code> | 指示器图形，按 check、checkbox、radio 替换。一处替换，所有使用处一起变。 |

## useTheme

`useTheme()` 读取最近的主题。不在 `Theme` 里时，名字是 `neutral`，`token()` 读文档上的 CSS 变量。读到的是主题本身的值，环境规则只在 CSS 里生效。返回的对象和 `token` 函数只创建一次，`tokens` 只在主题或明暗模式变了的时候才变。

| 字段 | 说明 |
| --- | --- |
| <code>name</code> | 最近的主题名。 |
| <code>mode</code> | 解析后的 <code>light</code> 或 <code>dark</code>。<code>system</code> 会被解析掉。 |
| <code>token(name)</code> | 当前模式下的一个 token。局部 token 按原名读。没人设置过的图表颜色返回默认值。 |
| <code>tokens</code> | 最近这份主题声明过的 token 和局部 token，按当前模式解析。 |

## 模板引用

组件暴露 `element`，类型是 `HTMLElement | null`。

## 原生属性

根节点是 `display: contents` 的 `div`。`class` 和 `style` 会写到它上面。其他属性不转发。

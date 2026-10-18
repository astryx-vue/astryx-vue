---
layout: component-docs
title: 顶部导航大菜单项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TopNavMegaMenuItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>这一项的标题。必填。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标题下面的一行说明文字。不传就不显示。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>点击后跳转的地址。不传这一项就渲染成按钮。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td>—</td><td>有链接时用来替换 <code>&lt;a&gt;</code> 的组件，优先于 <code>LinkProvider</code> 给的默认值。</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>左侧图标框里的 CSS 图标类名，例如 <code>i-carbon-flash</code>。同时有 <code>icon</code> 插槽时以插槽为准。</td></tr>
</tbody></table>
</div>

## 事件

这一项自己不发出事件。点击时会关闭外层的大菜单（<code>TopNavMegaMenu</code>），跳转由 <code>href</code> 或 <code>as</code> 指定的组件负责。

## 插槽

- `icon`：标题前面的图标，会替代 `iconClass` 的字形。这块对读屏隐藏，含义由标题承担。

---
layout: component-docs
title: 输入框组文本
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="InputGroupText 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>这个文本元素的 <code>id</code>。测试里要定位前缀或后缀，或者用 <code>aria-describedby</code> 指过来时会用到。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：要显示的文字或图标，原样放进文本元素里。

## 原生属性

这个组件渲染的是一个 `<span>`。没有声明成属性的东西会落到这个 span 上，所以 `class` 和 `style` 直接作用在前缀或后缀本身。

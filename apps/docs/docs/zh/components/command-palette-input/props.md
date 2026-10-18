---
layout: component-docs
title: 命令面板输入框
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CommandPaletteInput 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code></td><td>框里的灰色占位文字。没写 <code>label</code> 时，它也会被当作这个框的名字。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>placeholder</code></td><td>这个框给读屏用的名字。默认就是占位文字；「Search…」说不清在搜什么的时候，自己传一个。</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>挂载时是否自动聚焦。面板是画在页面里的时候会自动跳过，免得打开文档示例就抢走焦点。</td></tr>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>搜索文字，用 <code>v-model:value</code> 绑定。不传时，读写的是外层 <code>CommandPalette</code> 的搜索文字。</td></tr>
</tbody></table>
</div>

## 事件

- `update:value(value: string)`：下一个搜索文字。只有当 `value` 被绑定的时候才会触发。
- `valueChange(value: string)`：同一个值，用原来的回调名字再发一次，方便从 React 搬过来的代码。

## 插槽

- `end`：输入框后面的内容，例如清空按钮或 `Kbd` 快捷键提示。转圈会出现在它前面。
- `endContent`：同一个插槽的原始名字。两个都写时用 `end`。

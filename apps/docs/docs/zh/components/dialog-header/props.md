---
layout: component-docs
title: 对话框页眉
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="DialogHeader 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>对话框标题。打开时获得默认焦点，并为对话框命名。必填。</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>标题下方的次要文字。为空字符串时不渲染。</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示关闭按钮，点击时发出 <code>openChange(false)</code>。</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>关闭按钮的无障碍名称。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：点击关闭按钮时以 `false` 触发。

## 插槽

- `startContent`：标题之前的内容，例如返回按钮。
- `endContent`：关闭按钮之前的内容。

---
layout: component-docs
title: 对话标记文本
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatTokenizedText 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>tokens</code></td><td><code>ChatComposerToken[]</code></td><td>—</td><td>标记定义，类型跟输入框用的是同一个。每个非空的 <code>value</code> 按字面匹配。普通标记渲染成 <code>Badge</code>，带 <code>render</code> 的标记渲染成你自己的内容。</td></tr>
<tr><td><code>text</code></td><td><code>string</code></td><td>—</td><td>跟默认插槽一样，是消息文字，里面可能带着标记的值。没匹配上的部分原样输出。属性和插槽都写时，以属性为准。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：消息文字。这里只放纯文本，标记内容由 `tokens` 属性提供。没匹配上标记的部分原样输出。

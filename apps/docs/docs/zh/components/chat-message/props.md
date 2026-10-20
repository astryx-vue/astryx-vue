---
layout: component-docs
title: 对话消息
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatMessage 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>sender</code></td><td><code>'user' | 'assistant' | 'system'</code></td><td>—</td><td>这条消息是谁发的，必填。决定靠左还是靠右，也决定排版。写 <code>system</code> 时整行居中，头像、名字、元信息三个插槽都不显示。</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>正文上方的发送者名字，纯文本。正文第一条不是气泡时用它；如果第一条是气泡，名字写在气泡上，才能跟气泡的内边距对齐。</td></tr>
<tr><td><code>density</code></td><td><code>ChatDensity</code></td><td>跟列表，再退回 <code>'balanced'</code></td><td>疏密程度：<code>'compact'</code>、<code>'balanced'</code> 或 <code>'spacious'</code>。不写就跟着外层 <code>ChatMessageList</code>。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：消息正文，可以放气泡、工具调用、思考过程，或者一段自由内容。自由内容和消息边缘齐平；想让它跟气泡的文字列对齐，就套一个透明气泡。
- `avatar`：消息旁边的头像，一般用 `Avatar`。`sender` 是 `system` 时不显示。
- `name`：替代 `name` 属性。
- `metadata`：正文下方的元信息。最后一条不是气泡时用它；如果最后一条是气泡，改用气泡的 `metadata` 插槽。

## 暴露

- `element`：根元素 `<article>`。

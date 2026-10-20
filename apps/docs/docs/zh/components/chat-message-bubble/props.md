---
layout: component-docs
title: 对话消息气泡
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatMessageBubble 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'filled' | 'ghost'</code></td><td><code>'filled'</code></td><td><code>'filled'</code> 铺发送者那一侧的底色。<code>'ghost'</code> 保留内边距、去掉底色，混排内容照样能对齐。气泡里只有一个代码块，或者只有带 <code>astryx-chat-card</code> 类的元素时，气泡会去掉内边距和底色，让卡片跟气泡边缘齐平。</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>气泡上方的发送者名字，左右位置跟气泡内边距对齐。写在一条消息的第一条气泡上；如果第一条内容不是气泡，改用 <code>ChatMessage</code> 的 <code>name</code>。</td></tr>
<tr><td><code>group</code></td><td><code>'first' | 'middle' | 'last'</code></td><td>—</td><td>在一组气泡里的位置。会把靠发送者那一侧的圆角收小。单独一条气泡不用写。</td></tr>
<tr><td><code>width</code></td><td><code>string</code></td><td>—</td><td>换掉默认的 <code>max(80%, 280px)</code> 宽度上限。想让气泡里的内容铺满整列，就写 <code>100%</code>。配合 <code>variant="ghost"</code> 用来放卡片和附件。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：气泡正文。纯文本、Markdown 或者任意元素都行。气泡只负责表面。
- `name`：替代 `name` 属性。
- `metadata`：气泡下方的元信息，位置跟气泡内边距对齐。写在一条消息的最后一条气泡上；如果最后一条内容不是气泡，改用 `ChatMessage` 的 `metadata` 插槽。

## 暴露

- `element`：气泡表面那一层元素。

---
layout: component-docs
title: 对话消息元信息
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatMessageMetadata 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>timestamp</code></td><td><code>string</code></td><td>—</td><td>时间，或者别的短文本。排在这一行的最前面。</td></tr>
<tr><td><code>footer</code></td><td><code>string</code></td><td>—</td><td>时间和状态之间的次要文字，例如模型名。</td></tr>
<tr><td><code>status</code></td><td><code>'sending' | 'sent' | 'delivered' | 'read' | 'error'</code></td><td>—</td><td>送达状态，会显示本地化的图标和文字。<code>timestamp</code>、<code>footer</code>、<code>status</code> 三样都没有时，整行不渲染。</td></tr>
</tbody></table>
</div>

## 插槽

- `timestamp`：替代 `timestamp` 属性。想把纯文本换成 `Timestamp` 组件时用它。
- `footer`：替代 `footer` 属性。放复制、重试、表情这类按钮用它；每个按钮都要有自己的可读名字。

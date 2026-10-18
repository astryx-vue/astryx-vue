---
layout: component-docs
title: 对话消息列表
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatMessageList 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>density</code></td><td><code>ChatDensity</code></td><td><code>'balanced'</code></td><td>疏密程度：<code>'compact'</code>、<code>'balanced'</code> 或 <code>'spacious'</code>。会传给里面的消息。</td></tr>
<tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>跟疏密</td><td>顶层行与行之间的距离，按间距刻度取值。只改行距，不动内边距。</td></tr>
<tr><td><code>scrollToTopAction</code></td><td><code>() =&gt; Promise&lt;void&gt;</code></td><td>—</td><td>顶部哨兵进入滚动容器时调用，用来加载更早的消息。返回的 Promise 没结束前，顶部一直显示加载中。</td></tr>
<tr><td><code>isStreaming</code></td><td><code>boolean</code></td><td><code>false</code></td><td>助手还在写的时候把它设上，日志会标成 <code>aria-busy</code>。读屏就会等写完再播报一次，而不是一直念半句话。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>本地化的「消息列表」</td><td>这块消息记录给读屏用的名字。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：消息行，一般放 `ChatMessage` 和 `ChatSystemMessage`。
- `empty`：没有传默认插槽时显示的内容。

## 暴露

- `element`：根元素 `<div role="log">`。

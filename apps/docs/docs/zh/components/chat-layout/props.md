---
layout: component-docs
title: 对话布局
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatLayout 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>density</code></td><td><code>ChatDensity</code></td><td><code>'balanced'</code></td><td>疏密、气泡宽度，以及底部那层毛玻璃。<code>compact</code>、<code>balanced</code>、<code>spacious</code>。</td></tr>
<tr><td><code>scrollRef</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>换一个元素来滚，而不是布局自己滚。不传就自己滚、底部粘住；传了就改成压在目标元素上的固定层。</td></tr>
<tr><td><code>showScrollButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>渲染自带的滚到底按钮。想让 <code>scrollButton</code> 插槽成为唯一的控件、或者干脆不要按钮，就设为 <code>false</code>。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ChatLayout 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td>（默认）</td><td>消息记录，一般放一个 <code>ChatMessageList</code>。</td></tr>
<tr><td><code>composer</code></td><td>固定压在底部、毛玻璃之上，一般放一个 <code>ChatComposer</code>。</td></tr>
<tr><td><code>empty</code></td><td>默认插槽为空时显示，居中。放一个 <code>EmptyState</code> 外观最统一。</td></tr>
<tr><td><code>scrollButton</code></td><td>换掉自带的滚到底按钮。插槽参数有 <code>isVisible</code>、<code>label</code>，以及 <code>scrollToBottom</code>——它会清掉新消息提示并滚到底。</td></tr>
</tbody></table>
</div>

## 暴露

<div class="component-api-table" role="region" aria-label="ChatLayout 暴露" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>布局的最外层。</td></tr>
<tr><td><code>scrollToBottom</code></td><td><code>() =&gt; void</code></td><td>清掉新消息状态并滚到最新一条。</td></tr>
</tbody></table>
</div>

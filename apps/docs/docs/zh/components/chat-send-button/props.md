---
layout: component-docs
title: 发送按钮
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatSendButton 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>isStopShown</code></td><td><code>boolean</code></td><td>跟随外层输入区</td><td>显示停止而不是发送。放在输入区里不传，就让外层决定。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>取决于草稿能不能发</td><td>禁用发送，不禁用停止。放在输入区里不传，就跟着外层能不能发走。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>按钮尺寸，直接交给 <code>Button</code>。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ChatSendButton 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>send</code></td><td>—</td><td>按了发送。在输入区里没监听这个事件时，它会把当前草稿提交掉。</td></tr>
<tr><td><code>stop</code></td><td>—</td><td>按了停止。在输入区里没监听这个事件时，会走外层的停止逻辑。</td></tr>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>发送或停止之后跟着触发。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ChatSendButton 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>sendIcon</code></td><td>换掉那个向上的箭头。</td></tr>
<tr><td><code>stopIcon</code></td><td>换掉那个停止方块。</td></tr>
</tbody></table>
</div>

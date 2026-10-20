---
layout: component-docs
title: 滚到底按钮
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatLayoutScrollButton 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>isVisible</code></td><td><code>boolean</code></td><td>—</td><td>必填。按钮显示不显示。隐藏时它仍然挂在页面上，好做淡出，同时带 <code>inert</code>，不会被聚焦到。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>本地化的“Scroll to bottom”</td><td>传给它会展开成一枚带文字的胶囊。不传就只是一个向下的箭头图标。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ChatLayoutScrollButton 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>click</code></td><td>—</td><td>按钮被按了。<code>ChatLayout</code> 用它来清掉新消息提示并滚到底。</td></tr>
</tbody></table>
</div>

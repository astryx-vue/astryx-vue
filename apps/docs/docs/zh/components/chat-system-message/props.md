---
layout: component-docs
title: 对话系统消息
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatSystemMessage 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'default' | 'divider'</code></td><td><code>'default'</code></td><td><code>'default'</code> 居中显示一行文字。<code>'divider'</code> 两侧各画一条线，文字放在中间当标签，用来分隔日期或段落。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：消息文字，或者分隔线上的标签。必填。
- `icon`：文字前面的图标。`divider` 变体不用它。想让它大小一致，就套一层 `Icon`。

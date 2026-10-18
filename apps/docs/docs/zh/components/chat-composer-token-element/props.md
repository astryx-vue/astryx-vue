---
layout: component-docs
title: 对话标签元素
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatComposerTokenElement 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>token</code></td><td><code>ChatComposerToken</code></td><td>—</td><td>必填。要么是徽标配置 <code>{ value, label?, variant?, icon? }</code>，要么是自定义标签 <code>{ value, render }</code>。<code>value</code> 就是草稿里序列化出来的内容。</td></tr>
</tbody></table>
</div>

标签本身是一个带 `data-astryx-token`、`contenteditable="false"` 的 `span`，所以它能挨着序列化的草稿放着，却不会被敲进去。徽标标签画的是一个 `Badge`；`icon` 可以填内置图形名（比如 `check`），也可以填 Iconify 的 id（比如 `carbon:user`）。自定义标签画的就是 `render` 返回的内容。

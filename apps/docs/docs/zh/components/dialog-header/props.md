---
layout: component-docs
title: 对话框页眉
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="DialogHeader 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>对话框标题。打开时获得默认焦点，并为对话框命名。必填。</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>标题下方的次要文字。为空字符串且没有 <code>subtitle</code> 插槽时不渲染。</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示关闭按钮，点击时发出 <code>openChange(false)</code>。</td></tr>
<tr><td><code>endContentEdgeCompensation</code></td><td><code>'inline' | 'block' | 'all'</code></td><td>有关闭按钮时为 <code>all</code></td><td>后置槽补偿哪几条边。<code>inline</code> 只收行末，<code>block</code> 只收上下，<code>all</code> 两边都收。没有关闭按钮且不传这个属性时不补偿。</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td>跟界面语言</td><td>关闭按钮的无障碍名称。英文默认 Close，中文默认「关闭」。</td></tr>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td><code>false</code></td><td>底部画一条主题分隔线，颜色取 <code>--astryx-color-border</code>。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：点击关闭按钮时以 `false` 触发。

## 插槽

- `title`：替换标题里的文字，适合放行内内容。标题元素仍是对话框的名字。
- `subtitle`：副标题里的行内内容。
- `startContent`：标题之前的内容，例如返回按钮。
- `endContent`：关闭按钮之前的内容。

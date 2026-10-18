---
layout: component-docs
title: 命令面板项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CommandPaletteItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>这一行的身份。同一份列表里要保持唯一：高亮、active-descendant 和选中都靠它对上号。必填。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一行，点不动，键盘也会跳过它。会写上 <code>aria-disabled</code>。</td></tr>
<tr><td><code>isHighlighted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>这一行是不是键盘当前停的那一行。不传时，从外层的 <code>CommandPalette</code> 读。单独做预览时再显式传。</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在选择模式下，这一行是不是选中的那个值。不传时，拿 <code>value</code> 去和面板的 <code>v-model:value</code> 比。会写上 <code>aria-selected</code>。</td></tr>
</tbody></table>
</div>

## 事件

- `select(value: string)`：这一行被点了一下，或者按了 Enter、空格。放在 `CommandPalette` 里时，面板接着会写入这个值并关掉面板。

## 插槽

- `default`：这一行的内容。里面别放能交互的东西——图标、文字、快捷键提示都可以，按钮和链接不行。

---
layout: component-docs
title: 命令面板分组
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CommandPaletteGroup 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>heading</code></td><td><code>string</code></td><td>—</td><td>分组显示出来的标题。它同时是这个分组给读屏用的名字，写在 <code>aria-label</code> 上。必填。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：这个分组里的行，一般放 `CommandPaletteItem`。

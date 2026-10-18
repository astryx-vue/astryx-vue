---
layout: component-docs
title: 命令面板列表
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CommandPaletteList 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>Commands</code></td><td>这个列表框给读屏用的名字。默认值来自语言包，会跟随当前语言。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：列表内容，一般是一行行 `CommandPaletteItem`，外面套不套 `CommandPaletteGroup` 都行。

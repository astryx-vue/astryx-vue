---
layout: component-docs
title: 下拉菜单分组
outline: false
footer: false
---

## DropdownMenuGroup 属性

<div class="component-api-table" role="region" aria-label="DropdownMenuGroup 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string | number</code></td><td>—</td><td>分组上方的标题，同时作为这一组的无障碍名称。留空时分组没有名字。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：这一组的行，可以放动作行、勾选行、单选组、子菜单和分隔线。
- `title`：分组标题的富文本内容，会替代 `title` 属性的纯文字，并且仍然作为这一组的无障碍名称。

## 原生属性

属性会落到分组的外层元素上，也就是带 `role="group"` 的那个元素，所以 `class` 和 `style` 直接写就行。标题会拿到一个自动生成的 id，供 `aria-labelledby` 指向；没有标题的分组不写 `aria-labelledby`。

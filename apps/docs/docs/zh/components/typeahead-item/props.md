---
layout: component-docs
title: 自动补全项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TypeaheadItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>item</code></td><td><code>SearchableItem</code></td><td>—</td><td>这一行要显示的那条搜索结果。必填，主文字取自它的 <code>label</code>。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>主文字下面那行字。写了就盖过数据里的 <code>description</code>。</td></tr>
<tr><td><code>group</code></td><td><code>string</code></td><td>—</td><td>只为和原版属性名对上而接受。每一行自己不画分组标题，分组由下拉按 <code>item.auxiliaryData.group</code> 来排。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把这一行画成不可选。它还在列表里，方向键会跳过。</td></tr>
</tbody></table>
</div>

## 插槽

- `icon`：主文字前面的图标或头像。外面这层对读屏是隐藏的，所以图案不用起名。

另外，这一行自己也会读数据里的 `item.disabled`，所以某条结果不可选时，不传这个属性也会显示成不可选。

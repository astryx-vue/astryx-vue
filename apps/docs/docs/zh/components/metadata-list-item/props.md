---
layout: component-docs
title: 元数据列表项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="MetadataListItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这一项的名字，必填。值写在默认插槽里。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽：这一项的值。放什么都行：文字、徽章、链接，或者自己写的一段结构。
- `icon`：名字前面的图标。

名字和值会渲染成 <code>&lt;dt&gt;</code> 和 <code>&lt;dd&gt;</code>；列表把名字放到上面时，会变成一个上下叠的小块。两种情况下读屏都是先念名字再念值。

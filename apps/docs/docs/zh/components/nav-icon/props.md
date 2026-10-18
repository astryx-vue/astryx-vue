---
layout: component-docs
title: 导航图标
outline: false
footer: false
---

## NavIcon 属性

<div class="component-api-table" role="region" aria-label="NavIcon 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>画在圆形底上的 CSS 图标类名，例如 <code>i-carbon-search</code>。不传时渲染默认插槽里的内容。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>圆形底的直径。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>无障碍名称。传了之后这个圆对读屏来说就是一张图片；不传就对读屏隐藏，旁边已经有文字说明时这样做正好。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：图标内容。没有传 `iconClass` 时才用它。放一个 `Icon`，或任何同样大小的元素都可以。

这个圆只负责展示：它是一个 `span`，永远不会变成按钮或链接，所以不要往它上面挂点击。需要能按的时候用 `IconButton` 或者 `NavItem`。

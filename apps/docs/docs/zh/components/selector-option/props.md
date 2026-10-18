---
layout: component-docs
title: 选择器选项
outline: false
footer: false
---

## 属性

下面是一个 `SelectorOption` 对象上的字段。它们是数据，不是组件属性：放进 [选择器](/components/selector) 的 `options` 数组里，或者在 `option` 插槽里收到。

<div class="component-api-table" role="region" aria-label="SelectorOption 字段" tabindex="0">
<table><thead><tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>选中这一项时报出去的值。必填，同一个列表里不能重复。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这一行的主文字，也是它的无障碍名。必填。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>主文字下面那行小字。单独占一行，比主文字更小更淡。</td></tr>
<tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>主文字前面的图标，写 CSS 图标类名，例如 <code>i-carbon-user</code>。</td></tr>
<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>选项还留在列表里，但选不了。方向键会跳过它。</td></tr>
</tbody></table>
</div>

## 插槽

`Selector` 的 `option` 插槽用来换掉某一行的内容。它收到 `option`（上面那个对象）、`isActive`（指针或键盘当前停在哪一行）和 `isSelected`。

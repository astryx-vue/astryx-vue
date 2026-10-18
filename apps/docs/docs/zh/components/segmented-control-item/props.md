---
layout: component-docs
title: 分段控件项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SegmentedControlItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>这一段的唯一值，父控件拿它和 <code>v-model</code> 比。必填。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这一段的名字，就是看得见的文字；藏起文字时，它变成读屏用的名字。必填。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把文字藏起来，只留图标。文字仍然通过 <code>aria-label</code> 当这一段的名称。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只禁用这一段。它还在原位，但点不了，方向键也会跳过它。</td></tr>
</tbody></table>
</div>

## 插槽

- `icon`：文字前面的图案。放 `Icon` 进去，大小会跟着父控件走。

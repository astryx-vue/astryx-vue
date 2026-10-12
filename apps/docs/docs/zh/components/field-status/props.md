---
layout: component-docs
title: 字段状态
outline: false
footer: false
---

## FieldStatus 属性

<div class="component-api-table" role="region" aria-label="FieldStatus 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>type</code></td><td><code>'error' | 'warning' | 'success'</code></td><td>—</td><td>必填。决定图标和颜色。</td></tr>
<tr><td><code>message</code></td><td><code>string</code></td><td>—</td><td>必填。文案。空字符串不显示可见内容。</td></tr>
<tr><td><code>variant</code></td><td><code>'attached' | 'detached'</code></td><td><code>'attached'</code></td><td>attached 叠在上方控件下面。detached 是独立的一块。</td></tr>
<tr><td><code>isVisuallyHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>保留消息，但不显示色块。</td></tr>
</tbody></table>
</div>

类型 `FieldStatusProps` 和 `FieldStatusInput` 从 `@astryx-vue/core/Field` 导出。

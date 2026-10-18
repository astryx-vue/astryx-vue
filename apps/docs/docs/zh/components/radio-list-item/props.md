---
layout: component-docs
title: 单选列表项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="RadioListItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>RadioValue</code>（<code>string | number</code>）</td><td>—</td><td>这一行被选中时报给父组件的值。必填。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这一行的名字，也是单选按钮的无障碍名。必填。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>名字下面的一行小字，读屏会先读名字再读这句。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把这一行禁用。行还在组里，但选中不了。</td></tr>
<tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只读。选中状态还能看到、也会随表单提交，但改不了，行不会变暗。</td></tr>
</tbody></table>
</div>

## 插槽

- `end`：名字和说明的后面，靠右侧摆放，比如放个徽章或者价格。

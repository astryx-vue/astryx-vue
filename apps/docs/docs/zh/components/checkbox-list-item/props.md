---
layout: component-docs
title: 复选列表项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CheckboxListItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这一行的名字。它同时也是复选框的无障碍名，不用再另外起名。必填。</td></tr>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>这一行的身份，父组件拿它去数组里找。跟着 <code>CheckboxList</code> 用时必填，单独用时不用写。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>名字下面的一行小字。它也是复选框的说明，读屏会先读名字再读这句。</td></tr>
<tr><td><code>isChecked</code></td><td><code>CheckboxValue</code>（<code>boolean | 'indeterminate'</code>）</td><td><code>false</code></td><td>单独用时决定勾不勾。父组件传了数组时这个属性不起作用。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把这一行禁用。行还在，文字照样看得到，就是点不动了。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>这一行正在处理。复选框里转圈，也点不动。跟着 <code>CheckboxList</code> 用时，父组件的 <code>changeAction</code> 还没完成，它也会自动转圈。</td></tr>
</tbody></table>
</div>

## 事件

- `check(checked: boolean)`：单独用时，勾选状态变了就发出下一个状态。跟着 <code>CheckboxList</code> 用时这个事件不走，变化由父组件的 <code>change</code> 事件报出来。

## 插槽

- `end`：名字和说明的后面，比如放个徽章或者数量。

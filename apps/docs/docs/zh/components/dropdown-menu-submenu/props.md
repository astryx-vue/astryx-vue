---
layout: component-docs
title: 下拉菜单子菜单
outline: false
footer: false
---

## DropdownMenuSubMenu 属性

<div class="component-api-table" role="region" aria-label="DropdownMenuSubMenu 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>这一行的文字，也是下一级返回按钮里提到的父级名字。</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>标签下方的次要说明。</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>标签前的图标。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用后这一行不能打开下一级。</td></tr>
<tr><td><code>hasSpinner</code></td><td><code>boolean</code></td><td><code>false</code></td><td>用转圈代替行尾箭头，表示下一级还在加载。转圈是装饰，不阻止打开。</td></tr>
<tr><td><code>menuWidth</code></td><td><code>number | string</code></td><td>—</td><td>飞出面板的宽度。数字按像素处理，作为最小宽度并限制在视口内。固有尺寸关键字则作为首选宽度。钻入时不使用。</td></tr>
<tr><td><code>presentation</code></td><td><code>'flyout' | 'drill-in' | 'adaptive'</code></td><td><code>'adaptive'</code></td><td>下一级怎么出现。旁边飞出、在原菜单里替换当前行，或在菜单打开时按是否为紧凑触控界面决定。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="DropdownMenuSubMenu 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead><tbody>
<tr><td><code>openChange</code></td><td><code>boolean</code></td><td>飞出面板或钻入的视图打开、关闭时触发。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：下一级的行，可以放动作行、勾选行、单选组，以及更深一层的子菜单。
- `icon`：任意前置内容，替代 `icon` 属性。
- `label`：替代 `label` 属性的富文本。
- `description`：替代 `description` 属性的富文本。

## 行的元素

这一行就是带 `role="menuitem"` 和 `aria-haspopup="menu"` 的那个元素。它自己不会跳转：子菜单行永远是打开下一级，所以地址要写在下级那些行上。

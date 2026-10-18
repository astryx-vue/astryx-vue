---
layout: component-docs
title: 面包屑项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="BreadcrumbItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>要跳去的地址。不写就渲染成按钮。和 <code>menu</code> 二选一：带菜单的这一格是开关，不是链接。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接换成别的根组件时用，例如路由链接。写给有 <code>href</code> 又不是当前页的那几格。</td></tr>
<tr><td><code>isCurrent</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标成当前页面。渲染成 <code>&lt;span&gt;</code>，并写上 <code>aria-current="page"</code>。当前这一格也还能挂菜单。</td></tr>
<tr><td><code>menu</code></td><td><code>BreadcrumbMenuOption[]</code></td><td>—</td><td>把这一格变成同级去处的菜单开关。数组和下拉菜单的数据格式一样，可以有分隔线、勾选项和单选组。用了 <code>menu</code> 插槽时这个属性不起作用。</td></tr>
<tr><td><code>menuSize</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>supporting 变体下是 <code>sm</code>，其余是 <code>md</code></td><td>菜单里每一行的大小。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：这一格的文字。
- `startIcon`：文字前面的图标。
- `menu`：手写的菜单内容，可以放勾选项和单选组。用了它就不再看 `menu` 属性。

## 事件

- `click(event: MouseEvent)`：点击这一格时触发。当前页这一格会挡掉默认行为，也不触发事件。

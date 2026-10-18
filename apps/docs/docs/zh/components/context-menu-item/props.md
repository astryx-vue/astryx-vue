---
layout: component-docs
title: 上下文菜单项
outline: false
footer: false
---

## ContextMenuItem 属性

<div class="component-api-table" role="region" aria-label="ContextMenuItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>行内的主要文字。需要富文本时改用 <code>label</code> 插槽。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的次要说明。需要富文本时改用 <code>description</code> 插槽。</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>标签前的图标：一个 CSS 图标类，或一个绘制 SVG 的组件。想放任意内容时改用 <code>icon</code> 插槽。</td></tr>
<tr><td><code>endContent</code></td><td><code>string | number</code></td><td>—</td><td>跟在标签后面的纯文字。徽章这类富文本用 <code>endContent</code> 插槽。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>这一行要跳转的地址；给出后整行渲染成链接。</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>链接的打开方式，仅在给出 <code>href</code> 时使用。</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接关系，仅在给出 <code>href</code> 时使用。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用这一行。禁用的行会变淡，方向键和首字母查找都会跳过它，也不能被激活。</td></tr>
<tr><td><code>hasCloseOnSelect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>激活这一行后是否收起菜单。</td></tr>
<tr><td><code>variant</code></td><td><code>'default' | 'destructive'</code></td><td><code>'default'</code></td><td>这一行的视觉变体。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ContextMenuItem 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead><tbody>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>激活这一行时触发，带回触发它的那次点击。</td></tr>
</tbody></table>
</div>

## 插槽

- `label`：替代 `label` 属性的富文本。
- `icon`：任意前置内容，替代 `icon` 属性。
- `description`：替代 `description` 属性的富文本。
- `endContent`：标签后面的行尾内容。

这一行的角色是 `role="menuitem"`，键盘交给上层的菜单管：方向键、`Home`、`End` 和首字母查找都在行之间移动。

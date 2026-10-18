---
layout: component-docs
title: 导航标题菜单
outline: false
footer: false
---

## NavHeadingMenu 属性

<div class="component-api-table" role="region" aria-label="NavHeadingMenu 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>菜单的无障碍名称，写到 <code>aria-label</code> 上。标题文字本身说不清这个菜单是干什么的时候设置它。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>菜单宽度档，同时决定每一项的内边距。</td></tr>
<tr><td><code>minWidth</code></td><td><code>number | string</code></td><td>—</td><td>覆盖按档位算出的最小宽度。数字按像素处理。</td></tr>
<tr><td><code>focusRequest</code></td><td><code>'first' | 'last' | null</code></td><td><code>null</code></td><td>菜单打开后把焦点放到第一项或最后一项。标题的弹出面板会自己传进来，所以用键盘打开时焦点直接落在条目上。</td></tr>
</tbody></table>
</div>

## NavHeadingMenu 事件

<div class="component-api-table" role="region" aria-label="NavHeadingMenu 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody>
<tr><td><code>close</code></td><td>按下 Escape 时触发。<code>SideNavHeading</code> 和 <code>TopNavHeading</code> 已经接住了它，会把弹出面板关掉。</td></tr>
</tbody></table>
</div>

## NavHeadingMenu 插槽

<div class="component-api-table" role="region" aria-label="NavHeadingMenu 插槽" tabindex="0">
<table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>菜单里的条目。</td></tr>
</tbody></table>
</div>

## NavHeadingMenuItem 属性

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>条目的主要文字。想在条目里放富文本时改用默认插槽。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>文字下面的一行辅助说明。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>给出后这个条目渲染成链接。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接的根组件，例如 <code>RouterLink</code>。此时条目会同时写 <code>href</code> 和 <code>to</code>。</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>文字前面那个图标的 CSS 类名。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这个条目。点击不响应，方向键和首字母查找也会跳过它。</td></tr>
</tbody></table>
</div>

## NavHeadingMenuItem 事件

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead><tbody>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>激活这个条目时触发，触发时机在菜单收起之前。</td></tr>
</tbody></table>
</div>

## NavHeadingMenuItem 插槽

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem 插槽" tabindex="0">
<table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>富文本内容，替代 <code>label</code> 属性的纯文字。</td></tr>
<tr><td><code>icon</code></td><td>图标内容，优先于 <code>iconClass</code> 画出来的字形。</td></tr>
</tbody></table>
</div>

整个菜单是一个 `role="menu"`：方向键在条目之间移动并循环，直接按字母会跳到以该字母开头的下一个条目，Escape 关掉面板并把焦点还给标题。

---
layout: component-docs
title: 链接 Provider
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="LinkProvider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>component</code></td><td><code>LinkComponentType</code></td><td>—</td><td>子树里所有链接元素默认用的组件，例如 <code>RouterLink</code>、<code>NuxtLink</code>。它会收到 <code>href</code> 和 <code>to</code>。单个组件自己的 <code>as</code> 仍然优先。必填。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="LinkProvider 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>使用这个链接组件的子树。</td></tr>
</tbody></table>
</div>

## 其它导出

<div class="component-api-table" role="region" aria-label="LinkProvider 导出" tabindex="0">
<table><thead><tr><th>导出</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>useLinkComponent</code></td><td><code>() =&gt; ComputedRef&lt;Component | undefined&gt;</code></td><td>读最近一层 provider 给的链接组件，外层没有就是 <code>undefined</code>。用的时候写成 <code>props.as ?? linkComponent.value</code>，这样自己写的 <code>as</code> 依然优先。</td></tr>
</tbody></table>
</div>

## 会走 provider 的组件

下面这些组件在没写自己的 `as` 时，链接会交给 provider 里的组件：

- `Link`、`Button`、`Avatar`、`Token`
- `NavItem`、`NavMenuItem`、`NavHeadingMenuItem`、`SideNavHeading`、`TopNavItem`、`TopNavMegaMenuItem`、`TopNavMegaMenuFeaturedCard`
- `BreadcrumbItem`、`Tab`、`Item`（List）
- `DropdownMenuItem`、`ContextMenuItem`、`MoreMenuRow`、`TreeListItem`

不走 provider 的：`AppShell` 的跳转正文链接、`Outline` 的页内锚点、`ClickableCard`（它的可点击控件是一层视觉隐藏的 `<a>`），以及 Markdown 渲染出来的链接。

## 原生属性

组件本身不渲染元素，<code>class</code> 和 <code>style</code> 不会传下去。

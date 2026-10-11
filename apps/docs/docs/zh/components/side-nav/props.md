---
layout: component-docs
title: 侧边导航
outline: false
footer: false
---

## SideNav Props

<div class="component-api-table" role="region" aria-label="SideNav Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>当前语言的「侧边导航」</td><td>导航地标的无障碍名称。</td></tr>
      <tr><td><code>collapsible</code></td><td><code>boolean | SideNavCollapsible</code></td><td><code>false</code></td><td>允许收成图标栏。对象可设置初始状态、内置按钮和快捷键。</td></tr>
      <tr><td><code>isCollapsed</code></td><td><code>boolean</code></td><td>-</td><td>受控收起状态，配合 <code>v-model:is-collapsed</code>。</td></tr>
    </tbody>
  </table>
</div>

## SideNav 事件

<div class="component-api-table" role="region" aria-label="SideNav 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:isCollapsed</code></td><td>收起状态变化，用于 <code>v-model:is-collapsed</code>。</td></tr>
      <tr><td><code>collapsedChange</code></td><td>收起状态变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## SideNav Slots

<div class="component-api-table" role="region" aria-label="SideNav Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>导航主体，通常放分组和导航项。</td></tr>
      <tr><td><code>header</code></td><td>顶部品牌区。</td></tr>
      <tr><td><code>top</code></td><td>品牌区下面的附加内容。</td></tr>
      <tr><td><code>footer</code></td><td>底部内容，位于收起按钮之上。</td></tr>
      <tr><td><code>footerIcons</code></td><td>和收起按钮同一行的图标。</td></tr>
    </tbody>
  </table>
</div>

## SideNavSection Props

<div class="component-api-table" role="region" aria-label="SideNavSection Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>title</code></td><td><code>string</code></td><td>-</td><td>分组标题。收起后仍留给读屏。</td></tr>
      <tr><td><code>subtitle</code></td><td><code>string</code></td><td>-</td><td>标题下面的辅助文字。</td></tr>
      <tr><td><code>isHeaderHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏标题，读屏仍能读到。</td></tr>
    </tbody>
  </table>
</div>

## SideNavItem Props

<div class="component-api-table" role="region" aria-label="SideNavItem Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>项的名称。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>跳转地址。有下级时，点文字跳转，点箭头收起。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接根组件。</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>图标 CSS class。收起后没有图标的项不渲染。</td></tr>
      <tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>当前页。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用。</td></tr>
      <tr><td><code>collapsible</code></td><td><code>boolean | object</code></td><td>-</td><td>有下级时是否可收起。传 <code>false</code> 则下级一直展开。</td></tr>
    </tbody>
  </table>
</div>

## SideNavHeading Props

<div class="component-api-table" role="region" aria-label="SideNavHeading Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td><code>string</code></td><td>-</td><td>产品或应用名称。</td></tr>
      <tr><td><code>headingHref</code></td><td><code>string</code></td><td>-</td><td>主标题链接。</td></tr>
      <tr><td><code>superheading</code></td><td><code>string</code></td><td>-</td><td>主标题上方的小字。</td></tr>
      <tr><td><code>subheading</code></td><td><code>string</code></td><td>-</td><td>主标题下方的小字。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接根组件。</td></tr>
    </tbody>
  </table>
</div>

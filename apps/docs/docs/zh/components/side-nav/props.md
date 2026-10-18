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
      <tr><td><code>resizable</code></td><td><code>boolean | SideNavResizable</code></td><td><code>false</code></td><td>在结束边拖宽度。对象可设置初始宽度、最小和最大宽度，以及记住宽度的 <code>autoSaveId</code>。</td></tr>
      <tr><td><code>handleRef</code></td><td><code>HandleRef&lt;SideNavHandle&gt;</code></td><td>-</td><td>侧栏外面的按钮可以拿到收起、展开和切换。更常见的做法是两边共用 <code>v-model:is-collapsed</code>。</td></tr>
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
      <tr><td><code>widthChange</code></td><td>拖拽改变宽度时触发，参数是像素宽度。</td></tr>
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
      <tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>-</td><td>上方小字的链接。</td></tr>
      <tr><td><code>subheading</code></td><td><code>string</code></td><td>-</td><td>主标题下方的小字。</td></tr>
      <tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>-</td><td>下方小字的链接。</td></tr>
      <tr><td><code>logoLabel</code></td><td><code>string</code></td><td>-</td><td>标志单独成链接时的无障碍名称。不传则用 <code>heading</code>。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接根组件。</td></tr>
    </tbody>
  </table>
</div>

## SideNavHeading Slots

<div class="component-api-table" role="region" aria-label="SideNavHeading Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>标题前的标志。收起后只剩这一块。</td></tr>
      <tr><td><code>end</code></td><td>标题行末尾。</td></tr>
      <tr><td><code>menu</code></td><td>弹出菜单，通常放 <code>NavHeadingMenu</code>。作用域提供 <code>close</code> 和 <code>focusRequest</code>。</td></tr>
    </tbody>
  </table>
</div>

## SideNavCollapseButton Props

在展开和收起的侧栏之间切换。放在 `SideNav` 里时从侧栏读折叠状态；放在外面时用 `v-model:is-collapsed` 或 `collapsible` 绑同一个状态。

<div class="component-api-table" role="region" aria-label="SideNavCollapseButton Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>按钮文字。给了文字就渲染成「箭头 + 文字」的按钮；不给则只有箭头图标，无障碍名称用翻译好的「收起侧边栏 / 展开侧边栏」。</td></tr>
      <tr><td><code>collapsible</code></td><td><code>SideNavControlledCollapsible</code></td><td>-</td><td>受控的 <code>{ isCollapsed, onCollapsedChange }</code> 配置，给放在侧栏外面的按钮用。把同一个对象也交给 <code>SideNav</code>。它优先于 <code>isCollapsed</code>。</td></tr>
      <tr><td><code>isCollapsed</code></td><td><code>boolean</code></td><td>-</td><td>折叠状态，用于 <code>v-model:is-collapsed</code>。按钮不在侧栏里时用它和侧栏连到同一个状态。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>在 SideNav 里是 <code>sm</code>，外面是 <code>md</code></td><td>按钮尺寸。按钮放在有尺寸的容器外面、又要和旁边对齐时指定。</td></tr>
    </tbody>
  </table>
</div>

## SideNavCollapseButton 插槽

<div class="component-api-table" role="region" aria-label="SideNavCollapseButton 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>自定义按钮图标插槽的内容，替换默认的箭头。看得见的文字仍然来自 <code>label</code>。</td></tr>
    </tbody>
  </table>
</div>

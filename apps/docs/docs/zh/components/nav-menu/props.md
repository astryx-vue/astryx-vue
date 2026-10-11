---
layout: component-docs
title: 导航菜单
outline: false
footer: false
---

## NavMenu Props

<div class="component-api-table" role="region" aria-label="NavMenu Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>菜单的无障碍名称。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>菜单宽度档。</td></tr>
      <tr><td><code>focusRequest</code></td><td><code>'first' | 'last' | null</code></td><td><code>null</code></td><td>打开后把焦点放到第一项或最后一项。</td></tr>
    </tbody>
  </table>
</div>

## NavMenu 事件

<div class="component-api-table" role="region" aria-label="NavMenu 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>close</code></td><td>按下 Escape 时触发。由 <code>NavDisclosure</code> 接住并关闭面板。</td></tr>
    </tbody>
  </table>
</div>

## NavMenuItem Props

<div class="component-api-table" role="region" aria-label="NavMenuItem Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>菜单项文字。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>显示在文字下面的辅助说明。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>有地址时渲染成链接。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接根组件。</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>图标 CSS class。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用。键盘导航会跳过。</td></tr>
      <tr><td><code>keepOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>选中后不关闭菜单。</td></tr>
      <tr><td><code>isMenuItem</code></td><td><code>boolean</code></td><td><code>true</code></td><td>在菜单里是 <code>menuitem</code>。抽屉里设为 false。</td></tr>
    </tbody>
  </table>
</div>

## NavDisclosure Props

<div class="component-api-table" role="region" aria-label="NavDisclosure Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>弹出层的无障碍名称。</td></tr>
      <tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'below'</code></td><td>相对触发器的位置。</td></tr>
      <tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'start'</code></td><td>沿交叉轴的对齐。</td></tr>
      <tr><td><code>hover</code></td><td><code>boolean</code></td><td><code>false</code></td><td>悬停一段时间后打开，离开后关闭。</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>悬停打开前的等待，毫秒。</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>指针离开后的关闭等待，毫秒。</td></tr>
    </tbody>
  </table>
</div>

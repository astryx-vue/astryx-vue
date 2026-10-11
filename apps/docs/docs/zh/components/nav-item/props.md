---
layout: component-docs
title: 导航项
outline: false
footer: false
---

## NavItem Props

<div class="component-api-table" role="region" aria-label="NavItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>可见文字。图标模式下作为无障碍名称。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>有地址且未禁用时渲染成链接。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接根组件，例如 <code>RouterLink</code>。</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>-</td><td>链接的 target。为 <code>_blank</code> 时自动补上 <code>noopener noreferrer</code>。</td></tr>
      <tr><td><code>rel</code></td><td><code>string</code></td><td>-</td><td>链接的 rel。</td></tr>
      <tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>当前页。会设置 <code>aria-current="page"</code>。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用后渲染成按钮，不进入 Tab 顺序。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>高度和内边距。</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>图标的 CSS class，例如 <code>i-carbon-home</code>。</td></tr>
      <tr><td><code>selectedIconClass</code></td><td><code>string</code></td><td>-</td><td>选中时替换 <code>iconClass</code>。</td></tr>
      <tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只显示图标，文字留给读屏。</td></tr>
      <tr><td><code>block</code></td><td><code>boolean</code></td><td><code>false</code></td><td>占满所在行的宽度。</td></tr>
      <tr><td><code>plain</code></td><td><code>boolean</code></td><td><code>false</code></td><td>去掉自己的底色，由外层负责外观。</td></tr>
      <tr><td><code>expanded</code></td><td><code>boolean</code></td><td>-</td><td>是否展开下级。不传则不设置 <code>aria-expanded</code>。</td></tr>
      <tr><td><code>controls</code></td><td><code>string</code></td><td>-</td><td>展开内容的 id，写到 <code>aria-controls</code>。</td></tr>
      <tr><td><code>hasPopup</code></td><td><code>string</code></td><td>-</td><td>打开的弹出层类型，写到 <code>aria-haspopup</code>。</td></tr>
    </tbody>
  </table>
</div>

## NavItem 事件

<div class="component-api-table" role="region" aria-label="NavItem 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>click</code></td><td>点击时触发。禁用时会先阻止默认行为。</td></tr>
    </tbody>
  </table>
</div>

## NavItem Slots

<div class="component-api-table" role="region" aria-label="NavItem Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>替换可见文字。不传时使用 <code>label</code>。</td></tr>
      <tr><td><code>icon</code></td><td>图标。优先于 <code>iconClass</code> 的默认字形。</td></tr>
      <tr><td><code>selectedIcon</code></td><td>选中时的图标。</td></tr>
      <tr><td><code>end</code></td><td>文字右侧的附加内容，例如箭头或计数。</td></tr>
    </tbody>
  </table>
</div>

## NavIcon Props

<div class="component-api-table" role="region" aria-label="NavIcon Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>圆形底上的 CSS 图标 class。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>圆形的直径。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>有文字时作为图片的无障碍名称；不传则对读屏隐藏。</td></tr>
    </tbody>
  </table>
</div>

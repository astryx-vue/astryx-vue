---
layout: component-docs
title: 溢出列表
outline: false
footer: false
---

## OverflowList Props

<div class="component-api-table" role="region" aria-label="OverflowList Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>items</code></td><td><code>OverflowListItem[]</code></td><td>-</td><td>要排布的项。放不下的会进「更多」菜单。</td></tr>
      <tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td><code>2</code></td><td>项间距，使用间距刻度。</td></tr>
      <tr><td><code>minVisibleItems</code></td><td><code>number</code></td><td><code>0</code></td><td>至少留下几项。</td></tr>
      <tr><td><code>maxVisibleItems</code></td><td><code>number</code></td><td>-</td><td>最多留下几项。</td></tr>
      <tr><td><code>maxRows</code></td><td><code>number</code></td><td>-</td><td>最多排几行，剩下的再收起。</td></tr>
      <tr><td><code>collapseFrom</code></td><td><code>'start' | 'end'</code></td><td><code>'end'</code></td><td>从哪一头开始收。</td></tr>
      <tr><td><code>behavior</code></td><td><code>'observeSelf' | 'observeParent'</code></td><td><code>'observeSelf'</code></td><td>用自己的宽度还是父元素的内容宽度。</td></tr>
      <tr><td><code>visibleCount</code></td><td><code>number</code></td><td>-</td><td>直接指定可见项数，跳过测量。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>可见项和菜单项的链接根组件。</td></tr>
    </tbody>
  </table>
</div>

## OverflowList 事件

<div class="component-api-table" role="region" aria-label="OverflowList 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>select</code></td><td>选中一项时触发，参数是该项和点击事件。</td></tr>
    </tbody>
  </table>
</div>

## OverflowList Slots

<div class="component-api-table" role="region" aria-label="OverflowList Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>item</code></td><td>自定义一项。参数是 <code>{ item, index }</code>。</td></tr>
      <tr><td><code>overflow</code></td><td>自定义溢出区域。参数是 <code>{ items }</code>，默认是「更多」菜单。</td></tr>
    </tbody>
  </table>
</div>

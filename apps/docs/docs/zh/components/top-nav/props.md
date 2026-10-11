---
layout: component-docs
title: 顶部导航
outline: false
footer: false
---

## TopNav Props

<div class="component-api-table" role="region" aria-label="TopNav Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>当前语言的「顶部导航」</td><td>导航地标的无障碍名称。</td></tr>
      <tr><td><code>mobileQuery</code></td><td><code>string</code></td><td>-</td><td>命中这条媒体查询时，起始和中间内容收进移动导航。</td></tr>
    </tbody>
  </table>
</div>

## TopNav Slots

<div class="component-api-table" role="region" aria-label="TopNav Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td>品牌标题，窄屏时仍留在顶栏。</td></tr>
      <tr><td><code>start</code></td><td>标题右侧的内容。</td></tr>
      <tr><td><code>default</code></td><td>和 <code>start</code> 排在一起的导航项、菜单。</td></tr>
      <tr><td><code>center</code></td><td>居中区域。存在时顶栏改成三列。</td></tr>
      <tr><td><code>end</code></td><td>右侧操作。窄屏时仍留在顶栏。</td></tr>
    </tbody>
  </table>
</div>

## TopNavMenu Props

<div class="component-api-table" role="region" aria-label="TopNavMenu Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>触发按钮上的文字。</td></tr>
      <tr><td><code>items</code></td><td><code>TopNavMenuItem[]</code></td><td>-</td><td>数据项。也可以用默认插槽写 <code>NavMenuItem</code>。</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>悬停打开前的等待，毫秒。</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>指针离开后的关闭等待，毫秒。</td></tr>
    </tbody>
  </table>
</div>

## TopNavMegaMenu Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenu Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>触发按钮上的文字，也是面板的无障碍名称。</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>悬停打开前的等待，毫秒。</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>250</code></td><td>指针离开后的关闭等待，毫秒。</td></tr>
    </tbody>
  </table>
</div>

默认插槽放 `TopNavMegaMenuItem`。`featured` 插槽放 `TopNavMegaMenuFeaturedCard`。抽屉里同一组内容变成手风琴，不再使用菜单角色。

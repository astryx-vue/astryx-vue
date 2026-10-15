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

## TopNavHeading Props

<div class="component-api-table" role="region" aria-label="TopNavHeading Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td><code>string</code></td><td>-</td><td>产品或应用名称。只有标志、没有文字时可以不传。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>主标题链接。和 <code>headingHref</code> 相同，后者优先。</td></tr>
      <tr><td><code>headingHref</code></td><td><code>string</code></td><td>-</td><td>主标题链接。</td></tr>
      <tr><td><code>superheading</code></td><td><code>string</code></td><td>-</td><td>主标题上方的小字。</td></tr>
      <tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>-</td><td>上方小字的链接。</td></tr>
      <tr><td><code>subheading</code></td><td><code>string</code></td><td>-</td><td>主标题下方的小字。</td></tr>
      <tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>-</td><td>下方小字的链接。</td></tr>
      <tr><td><code>logoLabel</code></td><td><code>string</code></td><td>-</td><td>标志单独成链接、旁边没有可读文字时的无障碍名称。不传则用 <code>heading</code>。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>有地址时使用的链接根组件，可同时接收 <code>href</code> 和 <code>to</code>。</td></tr>
    </tbody>
  </table>
</div>

只有主标题有链接、且没有菜单时，整段标题是一个链接。有菜单、没有任何链接时，整段标题打开菜单。菜单和链接同时存在时，各行自己跳转，只有箭头打开菜单。

## TopNavHeading Slots

<div class="component-api-table" role="region" aria-label="TopNavHeading Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>logo</code></td><td>标题前的标志。和 <code>icon</code> 是同一个位置，<code>logo</code> 优先。</td></tr>
      <tr><td><code>icon</code></td><td>标题前的图标。</td></tr>
      <tr><td><code>end</code></td><td>标题行末尾，例如徽章。</td></tr>
      <tr><td><code>menu</code></td><td>弹出菜单，通常放 <code>NavHeadingMenu</code>。作用域提供 <code>close</code> 和 <code>focusRequest</code>。</td></tr>
    </tbody>
  </table>
</div>

## TopNavMegaMenuFeaturedCard Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenuFeaturedCard Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>title</code></td><td><code>string</code></td><td>-</td><td>卡片标题。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>标题下面的说明。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>整张卡片的链接。同时写了 <code>linkLabel</code> 时，链接改到卡片底部。</td></tr>
      <tr><td><code>image</code></td><td><code>string</code></td><td>-</td><td>正文上方的图片地址。</td></tr>
      <tr><td><code>imageAlt</code></td><td><code>string</code></td><td>-</td><td>图片的替代文本。不传时图片是装饰，读屏会跳过。</td></tr>
      <tr><td><code>linkLabel</code></td><td><code>string</code></td><td>-</td><td>卡片底部的行动文字。</td></tr>
      <tr><td><code>linkHref</code></td><td><code>string</code></td><td>-</td><td>行动文字的地址。不传则用 <code>href</code>。</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接根组件。</td></tr>
    </tbody>
  </table>
</div>

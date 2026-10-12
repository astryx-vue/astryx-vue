---
layout: component-docs
title: 应用外壳
outline: false
footer: false
---

## App Shell Props

<div class="component-api-table" role="region" aria-label="App Shell Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'wash' | 'surface' | 'section' | 'elevated'</code></td>
        <td><code>'elevated'</code></td>
        <td>页面背景。宽屏上 <code>elevated</code> 同时有顶栏和侧栏时，正文坐在圆角背板上。</td>
      </tr>
      <tr>
        <td><code>contentPadding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>正文区域内边距。不传则贴边。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>'fill' | 'auto'</code></td>
        <td><code>'fill'</code></td>
        <td><code>fill</code> 使用 <code>100dvh</code>。行内高度可以盖过这个长度。</td>
      </tr>
      <tr>
        <td><code>mobileNav</code></td>
        <td><code>false | AppShellMobileNav</code></td>
        <td>-</td>
        <td><code>false</code> 关掉抽屉。对象可以设置 <code>breakpoint</code>（<code>sm</code> 640、<code>md</code> 768、<code>lg</code> 1024、<code>xl</code> 1280、<code>2xl</code> 1536 或 <code>none</code>）、<code>isOpen</code> 和 <code>hasToggle</code>。</td>
      </tr>
      <tr>
        <td><code>mobileNavOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td><code>v-model:mobile-nav-open</code>。组件同时发出 <code>mobileNavOpenChange</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` 的取值是 `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`。默认断点是 <code>md</code>，查询是 <code>(width &lt; Npx)</code>。<code>hasToggle</code> 默认 true。

## 插槽

<div class="component-api-table" role="region" aria-label="App Shell Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>页面正文，渲染在主区域里。</td>
      </tr>
      <tr>
        <td><code>topNav</code></td>
        <td>顶栏，通常是 <code>TopNav</code>。窄屏时它的项目收进外壳的抽屉。</td>
      </tr>
      <tr>
        <td><code>sideNav</code></td>
        <td>侧栏，通常是 <code>SideNav</code>。窄于断点时改到抽屉里，不再排在正文旁边。</td>
      </tr>
      <tr>
        <td><code>banner</code></td>
        <td>导航和正文之间的横幅。</td>
      </tr>
      <tr>
        <td><code>mobileNav</code></td>
        <td>替换默认抽屉。</td>
      </tr>
    </tbody>
  </table>
</div>

## useAppShellMobile

从 <code>@astryx-vue/core</code> 引入。它返回最近的外壳：

<div class="component-api-table" role="region" aria-label="useAppShellMobile" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isMobile</code></td>
        <td><code>boolean</code></td>
        <td>视口窄于外壳断点时为 true。</td>
      </tr>
      <tr>
        <td><code>isMobileNavOpen</code></td>
        <td><code>boolean</code></td>
        <td>抽屉是否打开。</td>
      </tr>
      <tr>
        <td><code>isMobileNavEnabled</code></td>
        <td><code>boolean</code></td>
        <td>在外壳外面，或 <code>mobileNav</code> 为 false 时，是 false。</td>
      </tr>
      <tr>
        <td><code>hasAutoToggle</code></td>
        <td><code>boolean</code></td>
        <td>外壳是否自己画菜单按钮。</td>
      </tr>
      <tr>
        <td><code>hasSideNav</code></td>
        <td><code>boolean</code></td>
        <td>是否传了侧栏插槽。</td>
      </tr>
      <tr>
        <td><code>mobileNavId</code></td>
        <td><code>string</code></td>
        <td>抽屉的 id。顶栏项目会传送到 <code>#${id}-items</code>。</td>
      </tr>
      <tr>
        <td><code>toggleMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>切换抽屉。在外壳外面不做任何事。</td>
      </tr>
      <tr>
        <td><code>openMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>打开抽屉。</td>
      </tr>
      <tr>
        <td><code>closeMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关闭抽屉。</td>
      </tr>
    </tbody>
  </table>
</div>

主区域是 <code>#astryx-app-shell-main</code>，一个带 <code>role="main"</code> 和 <code>tabindex="-1"</code> 的 <code>div</code>。跳过链接的文案跟随当前语言。

## 原生属性

`AppShell` 渲染 `<div>`。

以下内容落到这个元素上：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

`class` 会合并。根元素写 `data-variant` 和 `data-height`。

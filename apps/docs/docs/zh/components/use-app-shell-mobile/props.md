---
layout: component-docs
title: useAppShellMobile
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useAppShellMobile 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isMobile</code></td>
        <td><code>boolean</code></td>
        <td>当前视口是否小于 AppShell 移动端导航的断点。用它让挨着 AppShell 的移动端界面跟移动端导航踩同一个断点。</td>
      </tr>
      <tr>
        <td><code>isMobileNavOpen</code></td>
        <td><code>boolean</code></td>
        <td>AppShell 管的那个移动端导航抽屉是否打开。</td>
      </tr>
      <tr>
        <td><code>mobileNavId</code></td>
        <td><code>string | undefined</code></td>
        <td>移动端导航抽屉的 DOM id，由 AppShell 设置。自定义按钮把它填进 <code>aria-controls</code>，读屏用户就知道这个按钮展开的是哪一块。不在管理抽屉的 AppShell 里时是 undefined。</td>
      </tr>
      <tr>
        <td><code>toggleMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>切换 AppShell 管的移动端导航抽屉。移动端导航停用时不做任何事。</td>
      </tr>
      <tr>
        <td><code>openMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>打开 AppShell 管的移动端导航抽屉。移动端导航停用时不做任何事。</td>
      </tr>
      <tr>
        <td><code>closeMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关闭 AppShell 管的移动端导航抽屉。</td>
      </tr>
      <tr>
        <td><code>isMobileNavEnabled</code></td>
        <td><code>boolean</code></td>
        <td>移动端导航是否已启用、并由 AppShell 管理。以下情况为 false：<code>mobileNav</code> 传了 <code>false</code>、没有导航内容、或者整个抽屉由自定义的 <code>mobileNav</code> 插槽负责。</td>
      </tr>
      <tr>
        <td><code>hasAutoToggle</code></td>
        <td><code>boolean</code></td>
        <td>AppShell 的自动切换按钮是否启用。<code>mobileNav.hasToggle</code> 传 <code>false</code> 时为 false。自己画按钮之前，先和 <code>isMobile</code>、<code>isMobileNavEnabled</code> 一起判断。</td>
      </tr>
      <tr>
        <td><code>hasSideNav</code></td>
        <td><code>boolean</code></td>
        <td>AppShell 有没有 <code>sideNav</code> 插槽。只有存在导航内容时才会托管移动端导航。</td>
      </tr>
    </tbody>
  </table>
</div>

返回的对象是稳定的、响应式的。在模板或计算属性里读这些字段，视口变化时它们会跟着更新。

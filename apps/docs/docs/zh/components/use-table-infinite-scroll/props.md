---
layout: component-docs
title: useTableInfiniteScroll
outline: false
footer: false
---

配置是 `MaybeRefOrGetter`，传 getter 或 ref，插件就能一直读到最新的值。

## 参数

<div class="component-api-table" role="region" aria-label="useTableInfiniteScroll 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hasMore</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>数据源还能不能再给一批。为 false 时，「加载更多」按钮和自动加载都会去掉。</td>
      </tr>
      <tr>
        <td><code>isLoading</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>你自己管理的加载状态。为 true 时不会发新请求。</td>
      </tr>
      <tr>
        <td><code>onLoadMore</code></td>
        <td><code>() =&gt; Promise&lt;void&gt;</code></td>
        <td>—</td>
        <td>取下一批并追加到你的行里，返回在这一批完成时 settle 的 Promise。Promise 被拒绝会暂停自动加载；返回的不是 Promise 也会暂停，并在开发环境给出警告。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableInfiniteScroll 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>loadingState</code></td>
        <td><code>() =&gt; TableLoadingState</code></td>
        <td>报告 <code>{ hasMore, isLoading }</code>。正在加载时，表格不显示默认的空状态。</td>
      </tr>
      <tr>
        <td><code>below</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td>在表格滚动区里渲染「加载更多」按钮，外加一个看不见的标记，由 <code>IntersectionObserver</code> 以视口为根观察。最后一批把按钮拿掉时，如果焦点在按钮上，焦点会移到滚动区，页面不会跟着滚动。</td>
      </tr>
    </tbody>
  </table>
</div>

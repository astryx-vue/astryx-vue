---
layout: component-docs
title: useTablePagination
outline: false
footer: false
---

## 参数

`useTablePagination()` 只有一个配置对象。用 getter 或 `ref` 包一层，控件才能读到最新的页码：`useTablePagination(() => ({ ... }))`。

<div class="component-api-table" role="region" aria-label="useTablePagination 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>page</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>必填。当前页码，从 1 开始。</td>
      </tr>
      <tr>
        <td><code>onPageChange</code></td>
        <td><code>(page: number) =&gt; void</code></td>
        <td>—</td>
        <td>必填。页码变化时调用。</td>
      </tr>
      <tr>
        <td><code>totalItems</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>所有页加起来一共多少条。控件用它算总页数。不传时控件看到的条数是 0。</td>
      </tr>
      <tr>
        <td><code>pageSize</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>每页多少条。切行时用同一个数。</td>
      </tr>
      <tr>
        <td><code>onPageSizeChange</code></td>
        <td><code>(pageSize: number) =&gt; void</code></td>
        <td>—</td>
        <td>用户改每页条数时调用。它和 <code>pageSizeOptions</code> 都给了才会出现每页条数选择器。</td>
      </tr>
      <tr>
        <td><code>pageSizeOptions</code></td>
        <td><code>number[]</code></td>
        <td><code>[10, 20, 50, 100]</code></td>
        <td>可选的每页条数。要配合 <code>onPageSizeChange</code> 才会出现选择器。</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>'below' | 'above' | 'both' | 'none'</code></td>
        <td><code>'below'</code></td>
        <td>控件画在哪。插件只能填表格下面那块，所以 <code>'below'</code> 和 <code>'both'</code> 画在下面，<code>'above'</code> 和 <code>'none'</code> 什么都不画。</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'center'</code></td>
        <td>控件的水平对齐。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>分页这块导航区的无障碍名称。不传时用分页组件自己的当前语言名称。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTablePagination()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件协议上的一个字段：

<div class="component-api-table" role="region" aria-label="useTablePagination 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>below</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td>在表格下面画出 <code>Pagination</code> 控件。<code>position</code> 把它挡掉时返回 <code>null</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

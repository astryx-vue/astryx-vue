---
layout: component-docs
title: useTablePagination
outline: false
footer: false
---

## 参数

`useTablePagination()` 只接一个配置对象。页码存在 `ref` 里时用 getter 包一层，控件每次读都能拿到最新的值：`useTablePagination(() => ({ ... }))`。

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
        <td>必填。当前页，从 1 计。</td>
      </tr>
      <tr>
        <td><code>onPageChange</code></td>
        <td><code>(page: number) =&gt; void</code></td>
        <td>—</td>
        <td>必填。翻页时调用。</td>
      </tr>
      <tr>
        <td><code>totalItems</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>全部条目数，用来算页数。没给它也没给 <code>totalPages</code> 时，控件只认 <code>hasMore</code>。</td>
      </tr>
      <tr>
        <td><code>totalPages</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>总页数。只知道页数、不知道条目数时用它。它优先于从 <code>totalItems</code> 算出来的页数。</td>
      </tr>
      <tr>
        <td><code>hasMore</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>后面还有没有下一页。游标分页用它：总数未知也能翻。为真时下一页按钮一直可点。</td>
      </tr>
      <tr>
        <td><code>pageSize</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>每页条目数。切行的时候要用同一个数。</td>
      </tr>
      <tr>
        <td><code>onPageSizeChange</code></td>
        <td><code>(pageSize: number) =&gt; void</code></td>
        <td>—</td>
        <td>用户改每页条数时调用。它和 <code>pageSizeOptions</code> 都给，才会出现每页条数选择器。</td>
      </tr>
      <tr>
        <td><code>pageSizeOptions</code></td>
        <td><code>number[]</code></td>
        <td><code>[10, 20, 50, 100]</code></td>
        <td>可选的每页条数。要出现选择器还需要 <code>onPageSizeChange</code>。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'pages' | 'count' | 'compact' | 'dots' | 'none'</code></td>
        <td><code>'pages'</code></td>
        <td>上一页和下一页之间放什么：页码按钮、「第几条到第几条 / 共几条」、紧凑的「第几页 / 共几页」、圆点，或者什么都不放。</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>'below' | 'above' | 'both' | 'none'</code></td>
        <td><code>'below'</code></td>
        <td>控件放在表格的哪一侧。取 <code>'both'</code> 时上下各有一组。</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'center'</code></td>
        <td>控件的水平对齐。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md'</code></td>
        <td><code>'md'</code></td>
        <td>控件高度。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>当前语言的「表格分页」</td>
        <td>分页导航区的无障碍名称。取 <code>position: 'both'</code> 时两块导航区的名字会区分开，后面分别加 <code>(top)</code> 和 <code>(bottom)</code>，同类型地标不会重名。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTablePagination()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件约定里的两个字段：

<div class="component-api-table" role="region" aria-label="useTablePagination 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>above</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td><code>position</code> 是 <code>'above'</code> 或 <code>'both'</code> 时，在表格上方画控件。</td>
      </tr>
      <tr>
        <td><code>below</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td><code>position</code> 是 <code>'below'</code> 或 <code>'both'</code> 时，在表格下方画控件。</td>
      </tr>
    </tbody>
  </table>
</div>

<code>position</code> 是 <code>'none'</code>，或者表格只有一页而且 <code>hasMore</code> 不是 <code>true</code> 时，两个都返回 <code>null</code>。

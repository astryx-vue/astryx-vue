---
layout: component-docs
title: 分页
outline: false
footer: false
---

## Pagination Props

<div class="component-api-table" role="region" aria-label="Pagination Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>page</code></td><td><code>number</code></td><td><code>1</code></td><td>当前页码，从 1 开始。</td></tr>
      <tr><td><code>pageSize</code></td><td><code>number</code></td><td><code>10</code></td><td>每页条目数。</td></tr>
      <tr><td><code>total</code></td><td><code>number</code></td><td><code>0</code></td><td>总条目数。</td></tr>
      <tr><td><code>showSizeChanger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示每页数量选择器。</td></tr>
      <tr><td><code>pageSizeOptions</code></td><td><code>number[]</code></td><td><code>[10, 20, 50, 100]</code></td><td>每页数量选项。</td></tr>
      <tr><td><code>showTotal</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示总条目数。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>prevLabel</code></td><td><code>string</code></td><td><code>Previous</code> / <code>上一页</code></td><td>上一页按钮文字。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>nextLabel</code></td><td><code>string</code></td><td><code>Next</code> / <code>下一页</code></td><td>下一页按钮文字。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>pageSizeLabel</code></td><td><code>string</code></td><td><code>Per page</code> / <code>每页</code></td><td>每页数量选择器的标签。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>variant</code></td><td><code>'pages' | 'count' | 'compact' | 'dots' | 'input' | 'none'</code></td><td><code>'pages'</code></td><td>中间区域。 <code>input</code> 是可输入的页码。</td></tr>
      <tr><td><code>siblingCount</code></td><td><code>number</code></td><td><code>1</code></td><td>页码形态下，当前页两侧各留几个页码。窄容器会再收一档。</td></tr>
      <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>上一页和下一页每次跳几页。</td></tr>
      <tr><td><code>hasMore</code></td><td><code>boolean</code></td><td>—</td><td>总数未知时，后面是否还有内容。<code>total</code> 大于 0 时以总条目数为准。</td></tr>
      <tr><td><code>pageLabel</code></td><td><code>string</code></td><td><code>Page</code> / <code>页</code></td><td><code>input</code> 形态里，输入框前面的名词。</td></tr>
      <tr><td><code>hasFirstLast</code></td><td><code>boolean</code></td><td>仅 <code>input</code> 且总页数已知</td><td>是否在上一页和下一页外侧放跳到首尾的按钮。</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(page: number) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>页码提交后再跑的动作。结束前控件标成忙碌，失败也不会把页码改回去。</td></tr>
    </tbody>
  </table>
</div>

## Pagination 事件

<div class="component-api-table" role="region" aria-label="Pagination 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:page</code></td><td><code>page: number</code></td><td>页码变化时触发。</td></tr>
      <tr><td><code>update:pageSize</code></td><td><code>pageSize: number</code></td><td>每页数量变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>page: number, pageSize: number</code></td><td>页码或每页数量变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## Pagination 插槽

<div class="component-api-table" role="region" aria-label="Pagination 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>total</code></td><td><code>{ total, from, to }</code></td><td>自定义总数显示。</td></tr>
    </tbody>
  </table>
</div>

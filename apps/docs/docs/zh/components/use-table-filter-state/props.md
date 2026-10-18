---
layout: component-docs
title: useTableFilterState
outline: false
footer: false
---

## 参数

`useTableFilterState()` 只有一个可选参数。

<div class="component-api-table" role="region" aria-label="useTableFilterState 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>initial</code></td>
        <td><code>TableFilterState</code></td>
        <td><code>{}</code></td>
        <td>可选的初始过滤映射。会浅拷贝一份，你传进来的对象不会被改。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableFilterState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filters</code></td>
        <td><code>Ref&lt;TableFilterState&gt;</code></td>
        <td>当前的过滤映射。读 <code>filters.value</code> 拿最新状态。</td>
      </tr>
      <tr>
        <td><code>onFilterChange</code></td>
        <td><code>(key: string, value: TableFilterValue | null) =&gt; void</code></td>
        <td>设置或清掉一个字段。映射会换成新对象，所以基于它写的 getter 能跟着更新。</td>
      </tr>
      <tr>
        <td><code>clearAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>清空映射。所有过滤一次性关掉。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterState

<div class="component-api-table" role="region" aria-label="TableFilterState 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>[fieldKey]</code></td>
        <td><code>TableFilterValue</code></td>
        <td>字段 key 到过滤值。<code>TableFilterValue</code> 是 <code>string | string[]</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

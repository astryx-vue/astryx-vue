---
layout: component-docs
title: useTableFilterState
outline: false
footer: false
---

## 参数

`useTableFilterState()` 只有一个可选参数，两种写法都行。

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
        <td>直接给初始过滤映射。它是浅拷贝的，你传进去的对象不会被写。</td>
      </tr>
      <tr>
        <td><code>initial.initialState</code></td>
        <td><code>TableFilterState</code></td>
        <td><code>{}</code></td>
        <td>把同一份映射放在 <code>initialState</code> 键里：<code>useTableFilterState({ initialState })</code>。过滤值不可能是对象，所以键名叫 <code>initialState</code> 且值是对象时，只可能是这种写法。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableFilterState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filters</code></td>
        <td><code>Ref&lt;TableFilterState&gt;</code></td>
        <td>活的过滤映射。读 <code>filters.value</code> 拿到当前状态。</td>
      </tr>
      <tr>
        <td><code>onFilterChange</code></td>
        <td><code>(key: string, value: TableFilterValue | null) =&gt; void</code></td>
        <td>设置或清掉一个字段。映射会换成新对象，所以用 getter 读它的地方会跟着更新。</td>
      </tr>
      <tr>
        <td><code>clearAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>清空整张映射。所有过滤一起关掉。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterState

<div class="component-api-table" role="region" aria-label="TableFilterState 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>[fieldKey]</code></td>
        <td><code>TableFilterValue</code></td>
        <td>字段 key 到过滤值的映射。<code>TableFilterValue</code> 是 <code>string | number | string[]</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useTableFiltering
outline: false
footer: false
---

## 参数

`useTableFiltering()` 只有一个配置对象。用 getter 或 `ref` 包一层，表格才能读到最新的过滤值：`useTableFiltering(() => ({ ... }))`。

<div class="component-api-table" role="region" aria-label="useTableFiltering 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filters</code></td>
        <td><code>TableFilterState</code></td>
        <td>—</td>
        <td>必填。当前过滤状态：字段 key 到过滤值的映射。</td>
      </tr>
      <tr>
        <td><code>onFilterChange</code></td>
        <td><code>(key: string, value: TableFilterValue | null) =&gt; void</code></td>
        <td>—</td>
        <td>必填。用户改过滤值时调用。传 <code>null</code> 表示清掉这条过滤。</td>
      </tr>
      <tr>
        <td><code>fields</code></td>
        <td><code>readonly TableFilterField[]</code></td>
        <td>—</td>
        <td>必填。列可以过滤的字段。每项有 <code>key</code>、<code>label</code>、<code>type</code>，以及可选的 <code>options</code>。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'popover'</code></td>
        <td><code>'popover'</code></td>
        <td>过滤控件的显示方式。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableFiltering()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件协议上的一个字段：

<div class="component-api-table" role="region" aria-label="useTableFiltering 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>filterFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableFilterContribution | null</code></td>
        <td>给一列造出控件。这列没有 <code>filter</code>，或者指向的字段不在 <code>fields</code> 里时返回 <code>null</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterContribution

<div class="component-api-table" role="region" aria-label="TableFilterContribution 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'popover'</code></td>
        <td>补上默认值之后的变体。</td>
      </tr>
      <tr>
        <td><code>field</code></td>
        <td><code>TableFilterField</code></td>
        <td>这一列指向的字段，取自 <code>fields</code>。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>TableFilterValue | null</code></td>
        <td><code>filters</code> 里这个字段的当前值。没有过滤时是 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>onChange</code></td>
        <td><code>(value: TableFilterValue | null) =&gt; void</code></td>
        <td>把新值交给你的 <code>onFilterChange</code>，字段 key 已经填好。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterField

<div class="component-api-table" role="region" aria-label="TableFilterField 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>key</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>字段 key。列的 <code>filter</code> 写的就是这个字符串，取值读 <code>row[key]</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>控件的标签和占位文字，读屏也用它当名字。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'string' | 'enum'</code></td>
        <td>—</td>
        <td><code>string</code> 按子串匹配，<code>enum</code> 按某一项精确匹配。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>readonly { value: string, label: string }[]</code></td>
        <td>—</td>
        <td><code>enum</code> 字段的可选项。没给 options 的 <code>enum</code> 字段会渲染成空下拉。</td>
      </tr>
    </tbody>
  </table>
</div>

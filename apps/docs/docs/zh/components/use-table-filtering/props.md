---
layout: component-docs
title: useTableFiltering
outline: false
footer: false
---

## 参数

`useTableFiltering()` 只接一个配置对象。过滤值存在 `ref` 里时用 getter 包一层，表格每次读都能拿到最新的值：`useTableFiltering(() => ({ ... }))`。

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
        <td>必填。当前的过滤状态：字段 key 到过滤值的映射。</td>
      </tr>
      <tr>
        <td><code>onFilterChange</code></td>
        <td><code>(key: string, value: TableFilterValue | null) =&gt; void</code></td>
        <td>—</td>
        <td>必填。用户改过滤值时调用。<code>null</code> 表示清掉这个过滤。</td>
      </tr>
      <tr>
        <td><code>fields</code></td>
        <td><code>readonly TableFilterField[]</code></td>
        <td>—</td>
        <td>必填。列可以过滤的字段。每一项有 <code>key</code>、<code>label</code>、<code>type</code>，以及这种类型需要的选项或范围。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'inline-compact' | 'popover'</code></td>
        <td><code>'popover'</code></td>
        <td>控件放在哪。<code>inline</code> 和 <code>inline-compact</code> 放在表头单元格里、列名下面，后者更紧凑；<code>popover</code> 藏在漏斗按钮后面，确认后才生效。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableFiltering()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件约定里的两个字段：

<div class="component-api-table" role="region" aria-label="useTableFiltering 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>只有行内变体才给：带过滤而且没写 <code>width</code> 的列补成 <code>proportional(1)</code>，控件在列名下面放得开。</td>
      </tr>
      <tr>
        <td><code>filterFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableFilterContribution | null</code></td>
        <td>生成这一列的控件。列没有 <code>filter</code>，或者它指的字段不在 <code>fields</code> 里时返回 <code>null</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterContribution

<div class="component-api-table" role="region" aria-label="TableFilterContribution 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'inline' | 'inline-compact' | 'popover'</code></td>
        <td>补完默认值之后的摆放方式。</td>
      </tr>
      <tr>
        <td><code>field</code></td>
        <td><code>TableFilterField</code></td>
        <td>列指到的字段，来自 <code>fields</code>。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>TableFilterValue | null</code></td>
        <td>当前值，来自 <code>filters</code>。这个字段还没有过滤时是 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>onChange</code></td>
        <td><code>(value: TableFilterValue | null) =&gt; void</code></td>
        <td>把新值交给你的 <code>onFilterChange</code>，字段 key 已经带上了。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterField

<div class="component-api-table" role="region" aria-label="TableFilterField 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>key</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>字段 key。列的 <code>filter</code> 里写这个字符串，字段读的是 <code>row[key]</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>控件的标签和占位文字，也是读屏读到的名字。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'string' | 'enum' | 'multi-select' | 'number' | 'date'</code></td>
        <td>—</td>
        <td>命中方式。<code>string</code> 匹配子串，<code>enum</code> 匹配一个选项，<code>multi-select</code> 匹配勾选中的任意一项，<code>number</code> 比数值，<code>date</code> 要求单元格日期比选的更晚。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>readonly { value: string, label: string }[]</code></td>
        <td>—</td>
        <td><code>enum</code> 和 <code>multi-select</code> 的选项。没有选项时列表是空的。</td>
      </tr>
      <tr>
        <td><code>min</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td><code>number</code> 字段能接受的最小值。</td>
      </tr>
      <tr>
        <td><code>max</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td><code>number</code> 字段能接受的最大值。</td>
      </tr>
      <tr>
        <td><code>step</code></td>
        <td><code>number</code></td>
        <td><code>isIntegerOnly</code> 时是 <code>1</code>，否则不设</td>
        <td><code>number</code> 字段的步进。</td>
      </tr>
      <tr>
        <td><code>isIntegerOnly</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td><code>number</code> 字段只接受整数。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableFilterValue

<div class="component-api-table" role="region" aria-label="TableFilterValue 取值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string | number | string[]</code></td>
        <td><code>number</code> 字段存数字，<code>multi-select</code> 存选项值数组，其余存字符串。<code>date</code> 字段存 ISO 日期，例如 <code>2026-03-21</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

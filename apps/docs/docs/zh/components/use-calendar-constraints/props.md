---
layout: component-docs
title: useCalendarConstraints
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useCalendarConstraints 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseCalendarConstraintsOptions&gt;</code></td>
        <td>—</td>
        <td>边界、跨度和自定义规则。会变时传 <code>ref</code> 或取值函数。</td>
      </tr>
      <tr>
        <td><code>options.min</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>最早能选的日期，<code>YYYY-MM-DD</code>。早于它的日子不可选。</td>
      </tr>
      <tr>
        <td><code>options.max</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>最晚能选的日期，<code>YYYY-MM-DD</code>。晚于它的日子不可选。</td>
      </tr>
      <tr>
        <td><code>options.dateConstraints</code></td>
        <td><code>ReadonlyArray&lt;(date: Date) =&gt; boolean&gt;</code></td>
        <td>—</td>
        <td>自定义规则，拿到原生 <code>Date</code>；任何一个返回 false，这一天就不可选。</td>
      </tr>
      <tr>
        <td><code>options.maxRangeSpan</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>范围最多跨几天，两端都算（7 就是 7 天的窗口）。有了 <code>rangeAnchor</code> 才生效。</td>
      </tr>
      <tr>
        <td><code>options.minRangeSpan</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>范围最少跨几天，两端都算。离起点太近的日子不可选，但起点本身始终可选；不允许只选一天的选择器要自己拒绝在起点上点第二下。</td>
      </tr>
      <tr>
        <td><code>options.rangeAnchor</code></td>
        <td><code>PlainDate | null</code></td>
        <td>—</td>
        <td>正在选的范围起点。跨度从这里量；没在选时为 null。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useCalendarConstraints 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isDateDisabled</code></td>
        <td><code>(date: PlainDate) =&gt; boolean</code></td>
        <td>这一天落在边界外、离起点比 <code>minRangeSpan</code> 允许的近（起点除外）、比 <code>maxRangeSpan</code> 允许的远，或者没通过某条 <code>dateConstraints</code> 时返回 true。</td>
      </tr>
      <tr>
        <td><code>minDate</code></td>
        <td><code>ComputedRef&lt;PlainDate | null&gt;</code></td>
        <td>解析后的 <code>min</code>，没给时为 null。</td>
      </tr>
      <tr>
        <td><code>maxDate</code></td>
        <td><code>ComputedRef&lt;PlainDate | null&gt;</code></td>
        <td>解析后的 <code>max</code>，没给时为 null。</td>
      </tr>
    </tbody>
  </table>
</div>

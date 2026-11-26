---
layout: component-docs
title: useCalendarDays
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useCalendarDays 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseCalendarDaysOptions&gt;</code></td>
        <td>—</td>
        <td>要排的月份和排法。选项会变时传 <code>ref</code> 或取值函数。</td>
      </tr>
      <tr>
        <td><code>options.year</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>月份所在的年，按 <code>options.calendar</code> 的纪年。</td>
      </tr>
      <tr>
        <td><code>options.month</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>月份在这一年里是第几个月，从 1 开始。公历 1 是一月、12 是十二月；希伯来历闰年从 1 数到 13。</td>
      </tr>
      <tr>
        <td><code>options.weekStartsOn</code></td>
        <td><code>0-6 | &#x27;sun&#x27; | &#x27;mon&#x27; | ...</code></td>
        <td><code>0</code></td>
        <td>一周的第一天，同时决定格子和 <code>dayNames</code> 的第一列。</td>
      </tr>
      <tr>
        <td><code>options.hasVariableRowCount</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>只用这个月需要的行数，不固定六行。公历月是 4 到 6 行，科普特历和埃塞俄比亚历短短的第十三个月是 1 到 2 行。</td>
      </tr>
      <tr>
        <td><code>options.calendar</code></td>
        <td><code>CalendarSystem</code></td>
        <td><code>&#x27;gregory&#x27;</code></td>
        <td>给 <code>year</code>、<code>month</code> 和每天的 <code>dayNumber</code> 编号的历法。每天的 <code>date</code> 和 <code>iso</code> 始终是公历。不读 provider 的历法；显示不了的历法退回公历，开发期警告一次。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useCalendarDays 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>days</code></td>
        <td><code>ComputedRef&lt;CalendarDay[]&gt;</code></td>
        <td>格子里的每一天，按顺序，含首尾补齐的前后月日子。每一天有 <code>date</code>（公历 <code>PlainDate</code>）、<code>iso</code>（<code>YYYY-MM-DD</code>）、<code>isOutside</code>（不属于这个月时为 true）和 <code>dayNumber</code>（在它所在的历法月里是第几天）。</td>
      </tr>
      <tr>
        <td><code>weeks</code></td>
        <td><code>ComputedRef&lt;CalendarDay[][]&gt;</code></td>
        <td>同样的日子，每七天一行。</td>
      </tr>
      <tr>
        <td><code>dayNames</code></td>
        <td><code>ComputedRef&lt;string[]&gt;</code></td>
        <td>表头的星期名，按 <code>InternationalizationProvider</code> 的语言，从 <code>weekStartsOn</code> 开始。</td>
      </tr>
      <tr>
        <td><code>totalCells</code></td>
        <td><code>ComputedRef&lt;number&gt;</code></td>
        <td>格子总数：固定六行时是 42，否则是行数乘 7。</td>
      </tr>
    </tbody>
  </table>
</div>

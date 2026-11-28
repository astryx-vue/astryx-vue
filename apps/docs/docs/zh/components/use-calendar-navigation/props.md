---
layout: component-docs
title: useCalendarNavigation
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useCalendarNavigation 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseCalendarNavigationOptions&gt;</code></td>
        <td>—</td>
        <td>显示哪个月、用哪种历法和翻月回调。受控时传取值函数，<code>focusDate</code> 变了标题和月份跟着变。</td>
      </tr>
      <tr>
        <td><code>options.initialValue</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>不受控时，从这一天所在的月开始。只在创建时读一次。</td>
      </tr>
      <tr>
        <td><code>options.focusDate</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>受控时显示这一天所在的月。和 <code>onFocusDateChange</code> 成对传。</td>
      </tr>
      <tr>
        <td><code>options.onFocusDateChange</code></td>
        <td><code>(focusDate: ISODateString) =&gt; void</code></td>
        <td>—</td>
        <td>翻月时收到新月份第一天的公历 ISO 日期。</td>
      </tr>
      <tr>
        <td><code>options.numberOfMonths</code></td>
        <td><code>1 | 2</code></td>
        <td><code>1</code></td>
        <td>同时显示几个连续的月。</td>
      </tr>
      <tr>
        <td><code>options.calendar</code></td>
        <td><code>CalendarSystem</code></td>
        <td><code>&#x27;gregory&#x27;</code></td>
        <td>按哪种历法翻月和写标题，例如 <code>'persian'</code>、<code>'hebrew'</code>。日期仍是公历 ISO。不读 provider 的历法。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useCalendarNavigation 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>baseMonth</code></td>
        <td><code>ComputedRef&lt;PlainDate&gt;</code></td>
        <td>当前月第一天的公历日期。</td>
      </tr>
      <tr>
        <td><code>visibleMonths</code></td>
        <td><code>ComputedRef&lt;PlainDate[]&gt;</code></td>
        <td>每个可见月第一天的公历日期。</td>
      </tr>
      <tr>
        <td><code>visibleCalendarMonths</code></td>
        <td><code>ComputedRef&lt;{ year: number, month: number }[]&gt;</code></td>
        <td>每个可见月在 <code>calendar</code> 里的年和月，和 <code>useCalendarDays</code> 的选项对得上。</td>
      </tr>
      <tr>
        <td><code>monthYearLabel</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>月份标题，按当前语言和 <code>calendar</code> 写，例如 “June 2026”；两个月时用 “ – ” 连起来。</td>
      </tr>
      <tr>
        <td><code>navigateMonth</code></td>
        <td><code>(delta: number, focusedDate?: ISODateString, offset?: number) =&gt; void</code></td>
        <td>往后（+1）或往前（-1）翻月。传了 <code>focusedDate</code> 时，按 <code>offset</code>（默认 7）算出翻过去后要聚焦的日子，写进 <code>pendingFocus</code>。</td>
      </tr>
      <tr>
        <td><code>pendingFocus</code></td>
        <td><code>Readonly&lt;Ref&lt;ISODateString | null&gt;&gt;</code></td>
        <td>翻月后要聚焦的日子；没有跨月聚焦时为 null。</td>
      </tr>
      <tr>
        <td><code>clearPendingFocus</code></td>
        <td><code>() =&gt; void</code></td>
        <td>目标日子拿到焦点后清掉 <code>pendingFocus</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

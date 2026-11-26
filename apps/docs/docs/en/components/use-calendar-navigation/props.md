---
layout: component-docs
title: useCalendarNavigation
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useCalendarNavigation Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseCalendarNavigationOptions&gt;</code></td>
        <td>—</td>
        <td>Which month to show, the calendar system, and the navigation callback. Pass a getter when controlled so the month follows <code>focusDate</code>.</td>
      </tr>
      <tr>
        <td><code>options.initialValue</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>Starting month when uncontrolled. Read once on creation.</td>
      </tr>
      <tr>
        <td><code>options.focusDate</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>Controlled date whose month is shown. Pair it with <code>onFocusDateChange</code>.</td>
      </tr>
      <tr>
        <td><code>options.onFocusDateChange</code></td>
        <td><code>(focusDate: ISODateString) =&gt; void</code></td>
        <td>—</td>
        <td>Receives the Gregorian ISO first day of the new month on navigation.</td>
      </tr>
      <tr>
        <td><code>options.numberOfMonths</code></td>
        <td><code>1 | 2</code></td>
        <td><code>1</code></td>
        <td>Number of consecutive months shown.</td>
      </tr>
      <tr>
        <td><code>options.calendar</code></td>
        <td><code>CalendarSystem</code></td>
        <td><code>&#x27;gregory&#x27;</code></td>
        <td>Calendar system whose months are stepped and labeled, such as <code>'persian'</code> or <code>'hebrew'</code>. Dates stay Gregorian ISO. The provider calendar is never read.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useCalendarNavigation Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>baseMonth</code></td>
        <td><code>ComputedRef&lt;PlainDate&gt;</code></td>
        <td>The Gregorian first day of the focus month.</td>
      </tr>
      <tr>
        <td><code>visibleMonths</code></td>
        <td><code>ComputedRef&lt;PlainDate[]&gt;</code></td>
        <td>The Gregorian first day of each visible month.</td>
      </tr>
      <tr>
        <td><code>visibleCalendarMonths</code></td>
        <td><code>ComputedRef&lt;{ year: number, month: number }[]&gt;</code></td>
        <td>Year and month of each visible month in <code>calendar</code>, matching the <code>useCalendarDays</code> options.</td>
      </tr>
      <tr>
        <td><code>monthYearLabel</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>Month header in the current locale and <code>calendar</code>, such as “June 2026”; two months are joined with “ – ”.</td>
      </tr>
      <tr>
        <td><code>navigateMonth</code></td>
        <td><code>(delta: number, focusedDate?: ISODateString, offset?: number) =&gt; void</code></td>
        <td>Steps forward (+1) or backward (-1). With <code>focusedDate</code>, it computes the day to focus after the step using <code>offset</code> (default 7) and stores it in <code>pendingFocus</code>.</td>
      </tr>
      <tr>
        <td><code>pendingFocus</code></td>
        <td><code>Readonly&lt;Ref&lt;ISODateString | null&gt;&gt;</code></td>
        <td>The day to focus after a month step, or null when no cross-month focus is pending.</td>
      </tr>
      <tr>
        <td><code>clearPendingFocus</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Clears <code>pendingFocus</code> once the target day has focus.</td>
      </tr>
    </tbody>
  </table>
</div>

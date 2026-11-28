---
layout: component-docs
title: useCalendarDays
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useCalendarDays Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseCalendarDaysOptions&gt;</code></td>
        <td>—</td>
        <td>The month to lay out and how. Pass a <code>ref</code> or a getter when the options change.</td>
      </tr>
      <tr>
        <td><code>options.year</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Year of the month to lay out, as <code>options.calendar</code> numbers it.</td>
      </tr>
      <tr>
        <td><code>options.month</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>The month's position in its year, 1-based. In the Gregorian calendar 1 is January and 12 is December; a Hebrew leap year runs from 1 to 13.</td>
      </tr>
      <tr>
        <td><code>options.weekStartsOn</code></td>
        <td><code>0-6 | &#x27;sun&#x27; | &#x27;mon&#x27; | ...</code></td>
        <td><code>0</code></td>
        <td>First day of the week. It sets the first column of both the grid and <code>dayNames</code>.</td>
      </tr>
      <tr>
        <td><code>options.hasVariableRowCount</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Use only as many week rows as the month needs instead of a fixed 6-row grid. That is 4 to 6 for a Gregorian month, and 1 or 2 for the short thirteenth month of the Coptic and Ethiopic calendars.</td>
      </tr>
      <tr>
        <td><code>options.calendar</code></td>
        <td><code>CalendarSystem</code></td>
        <td><code>&#x27;gregory&#x27;</code></td>
        <td>The calendar system that numbers <code>year</code>, <code>month</code> and each day's <code>dayNumber</code>. Every day keeps its Gregorian <code>date</code> and <code>iso</code>. The provider calendar is never read. A calendar the runtime cannot show falls back to Gregorian with a one-time warning in development.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useCalendarDays Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>days</code></td>
        <td><code>ComputedRef&lt;CalendarDay[]&gt;</code></td>
        <td>Every cell of the grid in order, including the filler days from the previous and next months. Each day has <code>date</code> (a Gregorian <code>PlainDate</code>), <code>iso</code> (<code>YYYY-MM-DD</code>), <code>isOutside</code> (true for a day outside the month) and <code>dayNumber</code> (its day of the calendar month).</td>
      </tr>
      <tr>
        <td><code>weeks</code></td>
        <td><code>ComputedRef&lt;CalendarDay[][]&gt;</code></td>
        <td>The same days grouped into rows of seven.</td>
      </tr>
      <tr>
        <td><code>dayNames</code></td>
        <td><code>ComputedRef&lt;string[]&gt;</code></td>
        <td>Weekday header names in the <code>InternationalizationProvider</code> locale, starting at <code>weekStartsOn</code>.</td>
      </tr>
      <tr>
        <td><code>totalCells</code></td>
        <td><code>ComputedRef&lt;number&gt;</code></td>
        <td>Number of cells in the grid: 42 for the fixed grid, otherwise rows times seven.</td>
      </tr>
    </tbody>
  </table>
</div>

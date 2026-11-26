---
layout: component-docs
title: useCalendarConstraints
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useCalendarConstraints Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseCalendarConstraintsOptions&gt;</code></td>
        <td>—</td>
        <td>Bounds, span limits and custom rules. Pass a <code>ref</code> or a getter when they change.</td>
      </tr>
      <tr>
        <td><code>options.min</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>Earliest selectable date, <code>YYYY-MM-DD</code>. Days before it are disabled.</td>
      </tr>
      <tr>
        <td><code>options.max</code></td>
        <td><code>ISODateString</code></td>
        <td>—</td>
        <td>Latest selectable date, <code>YYYY-MM-DD</code>. Days after it are disabled.</td>
      </tr>
      <tr>
        <td><code>options.dateConstraints</code></td>
        <td><code>ReadonlyArray&lt;(date: Date) =&gt; boolean&gt;</code></td>
        <td>—</td>
        <td>Custom rules that receive a native <code>Date</code>; if any returns false, the day is disabled.</td>
      </tr>
      <tr>
        <td><code>options.maxRangeSpan</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Maximum days a range may span, counting both endpoints (7 allows a 7-day window). Inactive until <code>rangeAnchor</code> is set.</td>
      </tr>
      <tr>
        <td><code>options.minRangeSpan</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Minimum days a range must span, counting both endpoints. Days too close to the start are disabled, except the start itself, so a picker that forbids single-day ranges must refuse a second click on the start.</td>
      </tr>
      <tr>
        <td><code>options.rangeAnchor</code></td>
        <td><code>PlainDate | null</code></td>
        <td>—</td>
        <td>The in-progress range start. Span limits are measured from it; null when no selection is underway.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useCalendarConstraints Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isDateDisabled</code></td>
        <td><code>(date: PlainDate) =&gt; boolean</code></td>
        <td>Returns true when the day is outside the bounds, closer to <code>rangeAnchor</code> than <code>minRangeSpan</code> allows (except the anchor itself), farther than <code>maxRangeSpan</code> allows, or fails any <code>dateConstraints</code> rule.</td>
      </tr>
      <tr>
        <td><code>minDate</code></td>
        <td><code>ComputedRef&lt;PlainDate | null&gt;</code></td>
        <td>Parsed <code>min</code>, or null when not given.</td>
      </tr>
      <tr>
        <td><code>maxDate</code></td>
        <td><code>ComputedRef&lt;PlainDate | null&gt;</code></td>
        <td>Parsed <code>max</code>, or null when not given.</td>
      </tr>
    </tbody>
  </table>
</div>

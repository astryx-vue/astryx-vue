---
layout: component-docs
title: Power Search
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="PowerSearch props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>config</code></td><td><code>PowerSearchConfig</code></td><td>required</td><td>Fields, operators, and the value each operator expects.</td></tr>
      <tr><td><code>filters</code></td><td><code>PowerSearchFilter[]</code></td><td>-</td><td>Current filters. When passed, the parent owns them and listens for updates.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Search</td><td>Accessible name of the input.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Hides the label visually and keeps it available to assistive tech. Omitted means hidden; <code>false</code> shows it. <code>labelHidden</code> is the older name. When both are set, this one wins.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>Search…</td><td>Placeholder while there are no filters.</td></tr>
      <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the input after mount.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows clear all while an editable filter exists. It removes every editable filter and keeps the read-only ones. The older <code>clearable</code> name works too.</td></tr>
      <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Blocks adding, editing, and removing.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Turns the whole search off.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>-</td><td>Why it is off. With <code>disabled</code>, the message shows in a tooltip on hover or keyboard focus and the input stays focusable with <code>aria-disabled</code>. The older <code>disabledReason</code> name works too.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>default</code></td><td>Validation status.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>-</td><td>Status text.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>attached</code></td><td>Places the message against the field, with a gap, or behind an info button in the field. All variants describe the input accessibly.</td></tr>
      <tr><td><code>maxTokenLength</code></td><td><code>number</code></td><td><code>40</code></td><td>How many characters of a value a token shows.</td></tr>
      <tr><td><code>maxSearchResults</code></td><td><code>number</code></td><td><code>10</code></td><td>Ranked field results for a non-empty query. An empty query browses up to 1,000 fields.</td></tr>
      <tr><td><code>maxOperatorMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Suggestions in string and entity value editors. It does not cap the field menu or enum menus.</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>-</td><td>Exact pixel width of the field menu. It does not size the value editor.</td></tr>
      <tr><td><code>popoverSaveButtonLabel</code></td><td><code>string</code></td><td>Apply</td><td>Label of the save button in the filter editor popover. The older <code>saveLabel</code> name works too.</td></tr>
      <tr><td><code>timezoneID</code></td><td><code>string</code></td><td>-</td><td>Time zone a date is read and written in, such as America/New_York. A date-only value shows, edits and stores as that day's midnight in it; unset, it is the UTC day. A value with <code>isDateOnly: false</code> keeps its time of day in this zone, or the viewer's zone when unset. The older <code>timeZone</code> name works too. Absolute dates are written in the provider's <code>calendar</code>.</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>none</code></td><td>Wrap tokens, collapse them on blur, or expand them in a layer.</td></tr>
      <tr><td><code>presentation</code></td><td><code>'popover' | 'bottom-sheet' | 'adaptive'</code></td><td><code>'adaptive'</code></td><td>Where filters are edited. <code>popover</code> is the inline input with the field menu and the editor popover. <code>bottom-sheet</code> turns the field into a trigger that opens a touch sheet: review, edit and remove filters under Filters, pick a field under Add filter, choose the operator and value in the value step, and press Done to apply every change at once. <code>adaptive</code> uses the sheet on a compact touch screen (a coarse primary pointer, and a viewport narrower than the theme's <code>md</code> breakpoint or shorter than 500px) and the popover elsewhere; server rendering and hydration use the popover. The choice is made when the sheet opens and held until its exit finishes. In the sheet, <code>menuWidth</code> and <code>overflow</code> have nothing to act on and warn once in development; the <code>editor</code> slot is not used either, and the value step takes only <code>components[type].editor</code>. Pass <code>popover</code> to keep the inline field on every device.</td></tr>
      <tr><td><code>resultCount</code></td><td><code>number | string</code></td><td>-</td><td>Match count. A number is formatted with the result plural. A string is shown as given.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>md</code></td><td>Size of the input and the tokens.</td></tr>
      <tr><td><code>components</code></td><td><code>PowerSearchComponents</code></td><td>-</td><td>Replace the token or the editor for one value type.</td></tr>
      <tr><td><code>containerClass</code></td><td><code>string</code></td><td>-</td><td>Added to the field shell, the layer that holds the label and the status message. It does not land on the bordered box or the native input.</td></tr>
      <tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>-</td><td>Inline style for the field shell. Same landing as <code>containerClass</code>.</td></tr>
      <tr><td><code>controlClass</code></td><td><code>string</code></td><td>-</td><td>Added to the bordered box. A <code>class</code> on the component lands there too, not on the native input.</td></tr>
      <tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>-</td><td>Inline style for the bordered box. A <code>style</code> on the component lands there too.</td></tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="PowerSearch events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:filters</code></td><td>the next filters</td><td>Filters changed. Use it with the two-way binding.</td></tr>
      <tr><td><code>change</code></td><td>filters, change type, index</td><td>The type is add, edit, or remove. The index is the filter that changed.</td></tr>
      <tr><td><code>focus</code></td><td>focus event</td><td>Focus entered the input.</td></tr>
      <tr><td><code>blur</code></td><td>focus event</td><td>Focus left the input.</td></tr>
    </tbody>
  </table>
</div>

## Slots

The icon sits before the tokens. <code>endContent</code> (also accepted as <code>end</code>) sits before the clear button and is the place for another action. The token and editor slots win over a component registered for a value type.

The component also exposes focus and blur methods, so a button outside the field can send the cursor back.

## Field definitions

`createPowerSearchConfig` accepts string, number, boolean, date, enum, enum list, and string list. Strings can contain, start with, end with, or equal a value. Numbers compare magnitude. Dates can be before, after, or between. A boolean does not ask for another value.

A hand-written config can also use time, a relative date, an entity list, a custom editor, and nested filters. A relative date is picked from a fixed set: 1, 3, 7, 14, or 30 days, 1, 2, or 4 weeks, and 1, 3, 6, or 12 months, in both directions. Values look like `3d_ago` and `2w_from_now`. Set `isPastAllowed` or `isFutureAllowed` to false to drop that direction. A custom editor needs a way to read the value back as text.

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
      <tr><td><code>labelHidden</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Hides the label visually and keeps it available to assistive tech.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>Search…</td><td>Placeholder while there are no filters.</td></tr>
      <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the input after mount.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows clear all once a filter exists.</td></tr>
      <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Blocks adding, editing, and removing.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Turns the whole search off.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>-</td><td>Why it is off. The input stays focusable when this is set.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>default</code></td><td>Validation status.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>-</td><td>Status text.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached'</code></td><td><code>attached</code></td><td>Places the message against the field, or with a gap.</td></tr>
      <tr><td><code>maxTokenLength</code></td><td><code>number</code></td><td><code>40</code></td><td>How many characters of a value a token shows.</td></tr>
      <tr><td><code>maxSearchResults</code></td><td><code>number</code></td><td><code>10</code></td><td>Ranked field results for a non-empty query. An empty query browses up to 1,000 fields.</td></tr>
      <tr><td><code>maxOperatorMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Suggestions in string and entity value editors. It does not cap the field menu or enum menus.</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>-</td><td>Exact pixel width of the field menu. It does not size the value editor.</td></tr>
      <tr><td><code>saveLabel</code></td><td><code>string</code></td><td>Apply</td><td>Label of the editor’s save button.</td></tr>
      <tr><td><code>timeZone</code></td><td><code>string</code></td><td>-</td><td>Time zone used when a date is shown, such as America/New_York.</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>none</code></td><td>Wrap tokens, collapse them on blur, or expand them in a layer.</td></tr>
      <tr><td><code>resultCount</code></td><td><code>number | string</code></td><td>-</td><td>Match count. A number is formatted with the result plural. A string is shown as given.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>md</code></td><td>Size of the input and the tokens.</td></tr>
      <tr><td><code>components</code></td><td><code>PowerSearchComponents</code></td><td>-</td><td>Replace the token or the editor for one value type.</td></tr>
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

The icon sits before the tokens. End content sits before the clear button and is the place for another action. The token and editor slots win over a component registered for a value type.

The component also exposes focus and blur methods, so a button outside the field can send the cursor back.

## Field definitions

`createPowerSearchConfig` accepts string, number, boolean, date, enum, enum list, and string list. Strings can contain, start with, end with, or equal a value. Numbers compare magnitude. Dates can be before, after, or between. A boolean does not ask for another value.

A hand-written config can also use time, a relative date, an entity list, a custom editor, and nested filters. A custom editor needs a way to read the value back as text.

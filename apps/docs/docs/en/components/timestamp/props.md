---
layout: component-docs
title: Timestamp
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Timestamp Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>An ISO instant, or unix seconds. Written to the <code>datetime</code> attribute.</td>
      </tr>
      <tr>
        <td><code>format</code></td>
        <td><code>TimestampFormat</code></td>
        <td><code>'auto'</code></td>
        <td><code>relative</code>, <code>relative_short</code>, <code>auto</code>, <code>date</code>, <code>date_long</code>, <code>date_weekday</code>, <code>date_time</code>, <code>time</code>, <code>system_date</code>, <code>system_date_time</code>, <code>system_time</code>, or <code>unix_seconds</code>.</td>
      </tr>
      <tr>
        <td><code>autoThreshold</code></td>
        <td><code>number</code></td>
        <td><code>604800</code></td>
        <td>Seconds before <code>auto</code> switches from a relative phrase to <code>date_time</code>.</td>
      </tr>
      <tr>
        <td><code>hasTooltip</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Shows a card with a copyable absolute time on hover or keyboard focus. <code>tooltipEntries</code> replaces the default lines.</td>
      </tr>
      <tr>
        <td><code>tooltipEntries</code></td>
        <td><code>TimestampTooltipEntry[]</code></td>
        <td>-</td>
        <td>Each entry picks a format, an optional <code>timezoneID</code>, and an optional label. An entry without a <code>timezoneID</code> follows the <code>timezoneID</code> prop, or the viewer's zone when that is not set; <code>'local'</code> always means the viewer's zone.</td>
      </tr>
      <tr>
        <td><code>timezoneID</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>IANA zone the absolute formats are written in, such as <code>'UTC'</code>. Omit it, or pass <code>'local'</code>, for the viewer's own zone. A named zone gives the same text on the server and in the browser. Relative formats ignore it, and a <code>tooltipEntries</code> row without its own <code>timezoneID</code> follows it.</td>
      </tr>
      <tr>
        <td><code>isTimezoneShown</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Appends a short zone name to <code>date_time</code> and <code>time</code>.</td>
      </tr>
      <tr>
        <td><code>isLive</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Refreshes a relative reading. The interval lengthens as the instant gets older.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>TextType</code></td>
        <td><code>'supporting'</code></td>
        <td>Typography role passed to <code>Text</code>.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>TextSize</code></td>
        <td>-</td>
        <td>Optional size override.</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>TextColor | 'disabled'</code></td>
        <td><code>'secondary'</code></td>
        <td><code>disabled</code> is painted by this component. The other names are text colors.</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>TextWeight</code></td>
        <td>-</td>
        <td>Optional weight override.</td>
      </tr>
    </tbody>
  </table>
</div>

An unknown <code>timezoneID</code>, on the prop or in an entry, warns in the console and falls back to the local zone.

Attributes you put on <code>Timestamp</code> land on the <code>&lt;time&gt;</code> element. Your own <code>aria-label</code> and <code>tabindex</code> replace the ones the component would add.

## Theming

The visible text uses the text tokens for the chosen color. <code>disabled</code> uses <code>--astryx-color-text-disabled</code>. The hover card is the shared <code>HoverCard</code>.

---
layout: component-docs
title: Tab List
outline: false
footer: false
---

## TabList Props

<div class="component-api-table" role="region" aria-label="TabList Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Currently selected tab value. Supports <code>v-model:value</code>.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>TabListSize</code></td>
        <td><code>'md'</code></td>
        <td>Tab size. Optional: <code>sm</code>, <code>md</code>, <code>lg</code>.</td>
      </tr>
      <tr>
        <td><code>layout</code></td>
        <td><code>TabListLayout</code></td>
        <td><code>'hug'</code></td>
        <td>Tab layout. Optional: <code>hug</code>, <code>fill</code>. <code>hug</code> sizes to content, <code>fill</code> distributes evenly.</td>
      </tr>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether to show a bottom divider.</td>
      </tr>
    </tbody>
  </table>
</div>

## TabList Events

<div class="component-api-table" role="region" aria-label="TabList Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>update:value</code></td>
        <td>Emitted when the selected value changes.</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td>Emitted when the selected value changes.</td>
      </tr>
    </tbody>
  </table>
</div>

## TabList Slots

<div class="component-api-table" role="region" aria-label="TabList Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>List of <code>Tab</code> elements.</td>
      </tr>
    </tbody>
  </table>
</div>

## Tab Props

<div class="component-api-table" role="region" aria-label="Tab Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Unique tab value.</td>
      </tr>
      <tr>
        <td><code>panelId</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>ID of the controlled panel for <code>aria-controls</code>.</td>
      </tr>
      <tr>
        <td><code>disabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the tab is disabled.</td>
      </tr>
    </tbody>
  </table>
</div>

## Tab Slots

<div class="component-api-table" role="region" aria-label="Tab Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Tab label text.</td>
      </tr>
    </tbody>
  </table>
</div>

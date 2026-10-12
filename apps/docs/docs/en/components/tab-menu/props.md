---
layout: component-docs
title: Tab Menu
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TabMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Trigger text when no option is selected, and the accessible name of the menu.</td></tr>
      <tr><td><code>options</code></td><td><code>TabMenuOption[]</code></td><td>-</td><td>Tabs collected behind the trigger.</td></tr>
    </tbody>
  </table>
</div>

## TabMenuOption

<div class="component-api-table" role="region" aria-label="TabMenuOption" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>value</code></td><td><code>string</code></td><td>Tab value passed to the parent <code>TabList</code>.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Menu item text. It replaces the trigger text while this option is selected.</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>CSS icon class, for example <code>i-carbon-settings</code>.</td></tr>
    </tbody>
  </table>
</div>

Selection is the parent list's <code>v-model:value</code>. The menu does not emit its own change event.

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
      <tr>
        <td><code>overflow</code></td>
        <td><code>'auto' | 'scroll' | 'visible'</code></td>
        <td><code>'auto'</code></td>
        <td>What happens when the tabs are wider than the strip. <code>auto</code> and <code>scroll</code> scroll sideways, fade the hidden edge, and offer page arrows. <code>visible</code> does not scroll. A selected tab that is out of view scrolls back into view immediately.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>ARIA role of the strip. <code>tablist</code> selects the tabs pattern: tabs get <code>role="tab"</code> with <code>aria-selected</code>, and each tab points at its panel through <code>panelId</code>. Left unset, the strip is a navigation landmark that marks the current tab with <code>aria-current</code> and renders a tab with <code>href</code> as a link. Any other value is passed through to the element.</td>
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
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Visible text of the tab, also used as the accessible name when <code>isLabelHidden</code> is set. The default slot wins when both are given.</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>URL to navigate to. Outside the tabs pattern the tab renders as a link; inside a <code>role="tablist"</code> strip it is ignored.</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>string | Component</code></td>
        <td><code>'a'</code></td>
        <td>Link root component, such as a router link. Only applies when <code>href</code> is given and the strip is not a tablist.</td>
      </tr>
      <tr>
        <td><code>isLabelHidden</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Visually hides the label so only the icon and end content show. The label stays available through <code>aria-label</code>.</td>
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
      <tr>
        <td><code>icon</code></td>
        <td>Icon shown while the tab is not selected.</td>
      </tr>
      <tr>
        <td><code>selectedIcon</code></td>
        <td>Icon shown while the tab is selected. Falls back to <code>icon</code>.</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td>Content after the label, such as a badge count or a status dot.</td>
      </tr>
    </tbody>
  </table>
</div>

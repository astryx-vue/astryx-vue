---
layout: component-docs
title: usePowerSearchConfig
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="usePowerSearchConfig parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>definitions</code></td>
        <td><code>readonly PowerSearchFieldDefinition[]</code></td>
        <td>required</td>
        <td>Typed field definitions: <code>key</code>, <code>type</code>, <code>label</code>, and <code>enumValues</code> for enum fields. They build the fields and the operators each one offers.</td>
      </tr>
      <tr>
        <td><code>configName</code></td>
        <td><code>string</code></td>
        <td><code>'PowerSearchConfig'</code></td>
        <td>The <code>name</code> of the returned config.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="usePowerSearchConfig return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>config</code></td>
        <td><code>PowerSearchConfig</code></td>
        <td>The configuration for <code>PowerSearch</code>, with fields and the operators that fit each type.</td>
      </tr>
      <tr>
        <td><code>applyFilters</code></td>
        <td><code>(filters: readonly PowerSearchFilter[], data: readonly T[]) =&gt; T[]</code></td>
        <td>Returns the rows that match the active filters. Time, relative dates, entities, and custom values keep every row unless the caller interprets them.</td>
      </tr>
    </tbody>
  </table>
</div>

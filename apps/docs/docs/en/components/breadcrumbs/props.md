---
layout: component-docs
title: Breadcrumbs
outline: false
footer: false
---

## Breadcrumbs Props

<div class="component-api-table" role="region" aria-label="Breadcrumbs Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>separator</code></td>
        <td><code>string</code></td>
        <td><code>'/'</code></td>
        <td>Decorative separator between items.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>BreadcrumbsVariant</code></td>
        <td><code>'default'</code></td>
        <td>Visual variant. Optional: default, supporting.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'Breadcrumb'</code></td>
        <td>Accessible label for the nav landmark.</td>
      </tr>
    </tbody>
  </table>
</div>

## Breadcrumbs Slots

<div class="component-api-table" role="region" aria-label="Breadcrumbs Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>List of <code>BreadcrumbItem</code> elements.</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Props

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link URL. Renders as a button when omitted.</td>
      </tr>
      <tr>
        <td><code>isCurrent</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether this is the current page. Renders as a <code>&lt;span&gt;</code> with <code>aria-current="page"</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Slots

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Breadcrumb label text.</td>
      </tr>
      <tr>
        <td><code>startIcon</code></td>
        <td>Icon rendered before the label.</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Events

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>click</code></td>
        <td>Emitted when clicked. Not emitted for the current page.</td>
      </tr>
    </tbody>
  </table>
</div>

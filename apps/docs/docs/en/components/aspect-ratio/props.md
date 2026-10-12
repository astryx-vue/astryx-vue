---
layout: component-docs
title: Aspect Ratio
outline: false
footer: false
---

## Aspect Ratio Props

<div class="component-api-table" role="region" aria-label="Aspect Ratio Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>ratio</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Width divided by height. <code>16 / 9</code> is a widescreen frame. Written to <code>--astryx-aspect-ratio</code>, not as an inline <code>aspect-ratio</code>.</td>
      </tr>
      <tr>
        <td><code>shape</code></td>
        <td><code>'rectangle' | 'ellipse'</code></td>
        <td><code>'rectangle'</code></td>
        <td>Container shape. Both shapes follow <code>ratio</code>. <code>ellipse</code> with <code>ratio</code> <code>1</code> is a circle.</td>
      </tr>
      <tr>
        <td><code>fit</code></td>
        <td><code>'cover' | 'contain' | 'center'</code></td>
        <td>-</td>
        <td>How the child fills the box. <code>cover</code> crops, <code>contain</code> letterboxes, <code>center</code> keeps the natural size. Omit it and the child sizes itself.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Aspect Ratio Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The content inside the ratio box. Pass one child when <code>fit</code> is set.</td>
      </tr>
    </tbody>
  </table>
</div>

## CSS variables

<div class="component-api-table" role="region" aria-label="Aspect Ratio CSS Variables" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-aspect-ratio</code></td>
        <td>The ratio. A stylesheet can override the variable or <code>aspect-ratio</code> itself.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

`AspectRatio` renders a `<div>`. HTML attributes, <code>aria-*</code>, <code>data-*</code>, <code>class</code>, and <code>style</code> go to that element. <code>class</code> is merged. The root also sets <code>data-shape</code>.

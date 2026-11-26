---
layout: component-docs
title: useDragToSnapPoints
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useDragToSnapPoints parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>target</code></td>
        <td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>—</td>
        <td>The element a drag moves, along <code>axis</code> only: a template ref, a getter or the element itself.</td>
      </tr>
      <tr>
        <td><code>options.axis</code></td>
        <td><code>'x' | 'y'</code></td>
        <td>—</td>
        <td>The axis the element moves along. A new one creates the drag again, starting where the element is.</td>
      </tr>
      <tr>
        <td><code>options.snapPoints</code></td>
        <td><code>ReadonlyArray&lt;number&gt;</code></td>
        <td>—</td>
        <td>Offsets in px along <code>axis</code> from the resting position, sorted before use. An empty list makes the drag do nothing. New ones create the drag again and leave the element where it is.</td>
      </tr>
      <tr>
        <td><code>options.flickThreshold</code></td>
        <td><code>number</code></td>
        <td><code>1008</code></td>
        <td>A release faster than this, in px/s, carries to the next snap point in its direction. The default is the flick speed measured for UIKit's sheet.</td>
      </tr>
      <tr>
        <td><code>options.onSettle</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>—</td>
        <td>Called with the snap point's index once the element settles on it. Read on each call.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useDragToSnapPoints returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>settleTo</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>Settles the element on the snap point at <code>index</code> without a drag, then calls <code>onSettle</code>. An index outside the snap points does nothing and warns in development.</td>
      </tr>
    </tbody>
  </table>
</div>

## createDragToSnapPoints

<div class="component-api-table" role="region" aria-label="createDragToSnapPoints" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>createDragToSnapPoints</code></td>
        <td><code>(element: HTMLElement, options: DragToSnapPointsOptions) =&gt; DragToSnapPoints</code></td>
        <td>For use outside a component. Takes the options above and returns <code>settleTo</code> and <code>destroy</code>.</td>
      </tr>
      <tr>
        <td><code>destroy</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Removes every listener and stops the element where it is.</td>
      </tr>
    </tbody>
  </table>
</div>

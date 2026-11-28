---
layout: component-docs
title: usePanGesture
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="usePanGesture parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>target</code></td>
        <td><code>MaybeRefOrGetter&lt;Element | null | undefined&gt;</code></td>
        <td>—</td>
        <td>The element to drag: a template ref, a getter or the element itself. A new node behind the ref creates the drag again; unmount destroys it.</td>
      </tr>
      <tr>
        <td><code>options.axis</code></td>
        <td><code>'x' | 'y'</code></td>
        <td>—</td>
        <td>Limits the drag to one axis; the other component of every value reads 0. Omit it to report both axes. A new value creates the drag again.</td>
      </tr>
      <tr>
        <td><code>options.onPan</code></td>
        <td><code>(event: PanGestureEvent) =&gt; void</code></td>
        <td>—</td>
        <td>Called as the drag begins, changes, ends at the release, or is cancelled. Read on each call, so a new function re-creates nothing.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

Nothing: the composable hands out no recognizer.

## PanGestureEvent

<div class="component-api-table" role="region" aria-label="PanGestureEvent" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>state</code></td>
        <td><code>'began' | 'changed' | 'ended' | 'cancelled'</code></td>
        <td>Where the drag is.</td>
      </tr>
      <tr>
        <td><code>translation</code></td>
        <td><code>{ x: number, y: number }</code></td>
        <td>The movement since the drag began, in px, without the travel it needed to begin.</td>
      </tr>
      <tr>
        <td><code>velocity</code></td>
        <td><code>{ x: number, y: number }</code></td>
        <td>In px per second: the release velocity at <code>'ended'</code>, 0 at <code>'cancelled'</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## createPanGesture

<div class="component-api-table" role="region" aria-label="createPanGesture" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>createPanGesture</code></td>
        <td><code>(element: Element, options: PanGestureOptions) =&gt; PanGesture</code></td>
        <td>For use outside a component. Takes the options above.</td>
      </tr>
      <tr>
        <td><code>destroy</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Removes every listener it added and cancels a drag in progress (one <code>'cancelled'</code> event).</td>
      </tr>
    </tbody>
  </table>
</div>

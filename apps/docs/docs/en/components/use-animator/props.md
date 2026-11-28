---
layout: component-docs
title: useAnimator
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useAnimator parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>target</code></td>
        <td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>—</td>
        <td>The element to drive: a template ref, a getter, or the element. The animator follows the element it points at, and does nothing while there is none.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useAnimator returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>animate</code></td>
        <td><code>(target: AnimatorValues, options?: { velocity?: AnimatorValues }) =&gt; Promise&lt;void&gt;</code></td>
        <td>Springs the given channels to the target on the state-change spring. Without <code>velocity</code>, each starts from its velocity on screen. Resolves when they arrive, or when a later call takes one over.</td>
      </tr>
      <tr>
        <td><code>decay</code></td>
        <td><code>(velocity: AnimatorValues) =&gt; Promise&lt;void&gt;</code></td>
        <td>Coasts from a release velocity, in units per second. Resolves when the channels stop, or when a later call takes one over.</td>
      </tr>
      <tr>
        <td><code>set</code></td>
        <td><code>(values: AnimatorValues) =&gt; void</code></td>
        <td>Puts the given channels at these values at once, ending their motion.</td>
      </tr>
      <tr>
        <td><code>get</code></td>
        <td><code>() =&gt; AnimatorSnapshot</code></td>
        <td>Every channel's value on screen now.</td>
      </tr>
      <tr>
        <td><code>getVelocity</code></td>
        <td><code>() =&gt; AnimatorSnapshot</code></td>
        <td>Every channel's velocity on screen now, in units per second.</td>
      </tr>
      <tr>
        <td><code>stop</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Halts every channel where it is on screen.</td>
      </tr>
    </tbody>
  </table>
</div>

## createAnimator

<div class="component-api-table" role="region" aria-label="createAnimator" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>createAnimator</code></td>
        <td><code>(element: HTMLElement) =&gt; Animator</code></td>
        <td>For use outside a component. Returns the methods above, plus <code>destroy</code>.</td>
      </tr>
      <tr>
        <td><code>destroy</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Stops every motion and lets the element go; the element keeps the values it shows. The animator does nothing after it.</td>
      </tr>
      <tr>
        <td><code>AnimatorValues</code></td>
        <td><code>Partial&lt;Record&lt;'x' | 'y' | 'scale' | 'rotate' | 'opacity', number&gt;&gt;</code></td>
        <td>Values or velocities by channel: <code>x</code> and <code>y</code> in px, <code>scale</code> with 1 as its size, <code>rotate</code> in degrees, <code>opacity</code> from 0 to 1.</td>
      </tr>
    </tbody>
  </table>
</div>

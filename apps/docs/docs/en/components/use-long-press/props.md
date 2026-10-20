---
layout: component-docs
title: useLongPress
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useLongPress parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>LongPressOptions</code></td>
        <td>—</td>
        <td>Configuration object. Required.</td>
      </tr>
      <tr>
        <td><code>options.onLongPress</code></td>
        <td><code>(point: { x: number, y: number }) =&gt; void</code></td>
        <td>—</td>
        <td>Fired with the press start point once the press is held for <code>delayMs</code>. Required.</td>
      </tr>
      <tr>
        <td><code>options.disabled</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>When true the detector is inert, so a disabled trigger can flip the flag without re-registering anything. Read on each press, so a ref or a getter works as well as a plain boolean.</td>
      </tr>
      <tr>
        <td><code>options.isDisabled</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>The same switch under its other name; either one being true keeps the detector inert.</td>
      </tr>
      <tr>
        <td><code>options.delayMs</code></td>
        <td><code>number</code></td>
        <td><code>500</code></td>
        <td>Hold duration before the press fires, in milliseconds.</td>
      </tr>
      <tr>
        <td><code>options.moveCancelPx</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>Movement past this distance on either axis cancels the press, treating it as a scroll or drag.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useLongPress return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>handlers</code></td>
        <td><code>{ onTouchStart, onTouchMove, onTouchEnd, onTouchCancel }</code></td>
        <td>The four touch listeners to spread onto the target element, e.g. <code>&lt;button v-on="press.handlers"&gt;</code>. A second finger, a lift, or a cancel ends the press; a move past <code>moveCancelPx</code> does too.</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td><code>(point: { x: number, y: number }) =&gt; void</code></td>
        <td>Begins detection at a point. Call it from <code>pointerdown</code>. It clears any pending press first, then re-arms the timer.</td>
      </tr>
      <tr>
        <td><code>moveTo</code></td>
        <td><code>(point: { x: number, y: number }) =&gt; boolean</code></td>
        <td>Reports the pointer's new position. Returns true while the press is still inside the tolerance; past it the press is cancelled and it returns false. Returns false as well when no press is pending.</td>
      </tr>
      <tr>
        <td><code>cancel</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Drops any pending press. Bind it to <code>pointerup</code> and <code>pointercancel</code>. Also runs when the component unmounts.</td>
      </tr>
    </tbody>
  </table>
</div>

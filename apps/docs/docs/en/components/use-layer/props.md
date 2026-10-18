---
layout: component-docs
title: useLayer
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useLayer parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mode</code></td>
        <td><code>'context' | 'fixed'</code></td>
        <td>required</td>
        <td>Positioning strategy: <code>context</code> follows an anchor element, <code>fixed</code> uses explicit <code>x</code> / <code>y</code> coordinates.</td>
      </tr>
      <tr>
        <td><code>anchor</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>External anchor element for context mode. Leave it out and bind the returned <code>anchorRef</code> to the trigger instead.</td>
      </tr>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'below'</code></td>
        <td>Side of the anchor the layer is placed on. Logical: <code>start</code> / <code>end</code> mirror under RTL. Flips when there is no room.</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'center'</code></td>
        <td>Alignment along the placement axis.</td>
      </tr>
      <tr>
        <td><code>gap</code></td>
        <td><code>number</code></td>
        <td><code>4</code></td>
        <td>Clearance between the anchor and the layer, in pixels.</td>
      </tr>
      <tr>
        <td><code>x</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>0</code></td>
        <td>Horizontal viewport coordinate for fixed mode.</td>
      </tr>
      <tr>
        <td><code>y</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>0</code></td>
        <td>Vertical viewport coordinate for fixed mode.</td>
      </tr>
      <tr>
        <td><code>isDefaultOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the layer is open on the first render.</td>
      </tr>
      <tr>
        <td><code>lightDismiss</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>false</code></td>
        <td>Whether clicking outside dismisses the layer.</td>
      </tr>
      <tr>
        <td><code>lazyMount</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>false</code></td>
        <td>Whether to wait for the first <code>show()</code> before rendering the content. <code>isMounted</code> reports the answer.</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when <code>show()</code> opens the layer. Opening through <code>isDefaultOpen</code> is not a show, so it does not fire.</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when <code>hide()</code> closes the layer.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useLayer returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ShallowRef&lt;boolean&gt;</code></td>
        <td>Whether the layer is currently open.</td>
      </tr>
      <tr>
        <td><code>anchorRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Anchor element for context mode. Bind it with <code>:ref</code>; unset in fixed mode.</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Layer container. Measured for positioning and used for outside clicks.</td>
      </tr>
      <tr>
        <td><code>contentStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>Inline coordinates: measured <code>top</code> / <code>left</code> in context mode, <code>position: fixed</code> plus <code>x</code> / <code>y</code> in fixed mode.</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>Placement actually in effect after flipping for available space. Equal to the requested placement in fixed mode.</td>
      </tr>
      <tr>
        <td><code>isMounted</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether the content should render. Stays false until the first <code>show()</code> while <code>lazyMount</code> is on.</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>Unique ID for <code>aria-controls</code> or <code>aria-describedby</code>.</td>
      </tr>
      <tr>
        <td><code>anchorId</code></td>
        <td><code>string</code></td>
        <td>CSS identifier for the anchor element, for advanced positioning cases.</td>
      </tr>
      <tr>
        <td><code>show</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Imperatively show the layer.</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Imperatively hide the layer.</td>
      </tr>
    </tbody>
  </table>
</div>

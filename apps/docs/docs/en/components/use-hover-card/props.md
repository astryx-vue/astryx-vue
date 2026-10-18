---
layout: component-docs
title: useHoverCard
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useHoverCard parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'above'</code></td>
        <td>Side of the trigger the card is placed on. Logical: <code>start</code> / <code>end</code> mirror under RTL. Flips when there is no room.</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'center'</code></td>
        <td>Alignment along the placement axis.</td>
      </tr>
      <tr>
        <td><code>delay</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>300</code></td>
        <td>Delay before showing the hover card on hover, in milliseconds.</td>
      </tr>
      <tr>
        <td><code>hideDelay</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>200</code></td>
        <td>Delay before hiding after the pointer or focus leaves, so the pointer can travel into the card.</td>
      </tr>
      <tr>
        <td><code>focusTrigger</code></td>
        <td><code>'auto' | 'always' | 'never' | MaybeRefOrGetter</code></td>
        <td><code>'auto'</code></td>
        <td>When focus opens the card. <code>auto</code> only attaches focus listeners to naturally focusable elements.</td>
      </tr>
      <tr>
        <td><code>touchTrigger</code></td>
        <td><code>'auto' | 'tap' | 'none' | MaybeRefOrGetter</code></td>
        <td><code>'auto'</code></td>
        <td>What a tap does where there is no hover. <code>auto</code> opens on tap unless the trigger performs an action of its own; <code>tap</code> always opens; <code>none</code> never opens on touch.</td>
      </tr>
      <tr>
        <td><code>isEnabled</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether the hover and focus triggers are live.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>Accessible name for the card. When provided the card is exposed as a named <code>role="dialog"</code>; when omitted it falls back to <code>role="group"</code>, which may validly be unnamed.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>Controlled open state. <code>true</code> force-shows, <code>false</code> force-hides, <code>undefined</code> lets hover and focus manage visibility.</td>
      </tr>
      <tr>
        <td><code>isDefaultOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the card is shown on mount.</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when the card becomes visible.</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when the card is hidden.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useHoverCard returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the card is showing.</td>
      </tr>
      <tr>
        <td><code>triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Trigger element. Bind it with <code>:ref</code>; the hook attaches the handlers and ARIA relationships.</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Card container.</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>Unique ID of the card.</td>
      </tr>
      <tr>
        <td><code>anchorId</code></td>
        <td><code>string</code></td>
        <td>CSS identifier for the anchor element, for advanced positioning cases.</td>
      </tr>
      <tr>
        <td><code>describedBy</code></td>
        <td><code>string</code></td>
        <td>ID to compose into <code>aria-describedby</code>. The hook already writes it onto <code>triggerRef</code>; it is here for hand-written ARIA.</td>
      </tr>
      <tr>
        <td><code>contentStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>Inline coordinates for the card.</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>Placement actually in effect, after flipping for available space.</td>
      </tr>
      <tr>
        <td><code>isDialog</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether the card is exposed as a named dialog rather than an unnamed group.</td>
      </tr>
      <tr>
        <td><code>contentProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>Attributes for the card: <code>id</code>, <code>role</code>, <code>aria-label</code>, and the pointer/focus handlers that keep it open.</td>
      </tr>
      <tr>
        <td><code>show</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Imperatively show the card immediately.</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Imperatively hide the card immediately.</td>
      </tr>
    </tbody>
  </table>
</div>

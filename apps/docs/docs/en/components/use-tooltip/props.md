---
layout: component-docs
title: useTooltip
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useTooltip parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'above'</code></td>
        <td>Position relative to the trigger. Logical: <code>start</code> / <code>end</code> mirror under RTL. Flips when there is no room.</td>
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
        <td><code>200</code></td>
        <td>Delay before showing on hover, in milliseconds.</td>
      </tr>
      <tr>
        <td><code>hideDelay</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>0</code></td>
        <td>Delay before hiding after the pointer or focus leaves, in milliseconds. <code>0</code> uses the internal 100 ms bridge instead.</td>
      </tr>
      <tr>
        <td><code>focusTrigger</code></td>
        <td><code>'auto' | 'always' | 'never' | MaybeRefOrGetter</code></td>
        <td><code>'auto'</code></td>
        <td>When focus opens the tooltip. <code>auto</code> only attaches focus listeners to naturally focusable elements.</td>
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
        <td>Whether hover and focus triggers are enabled.</td>
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
        <td>Whether the tooltip is shown on mount.</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when the tooltip becomes visible.</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when the tooltip is hidden.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTooltip returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether the tooltip is showing. A controlled <code>isOpen</code> wins over the hover state.</td>
      </tr>
      <tr>
        <td><code>triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Trigger element. Bind it with <code>:ref</code>; the hook attaches the handlers and the ARIA link.</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Bubble container.</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>Unique ID of the bubble.</td>
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
        <td>Inline coordinates for the bubble.</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>Placement actually in effect, after flipping for available space.</td>
      </tr>
      <tr>
        <td><code>contentProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>Attributes for the bubble: <code>id</code>, <code>role="tooltip"</code>, and the pointer handlers that keep it open.</td>
      </tr>
    </tbody>
  </table>
</div>

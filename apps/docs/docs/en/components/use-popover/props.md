---
layout: component-docs
title: usePopover
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="usePopover parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'below'</code></td>
        <td>Side of the trigger the popover is placed on. Logical: <code>start</code> / <code>end</code> mirror under RTL. Flips when there is no room.</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'start'</code></td>
        <td>Alignment along the placement axis.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>Controlled open state. Leave it out to let the hook own the state.</td>
      </tr>
      <tr>
        <td><code>isEnabled</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether the trigger opens the popover.</td>
      </tr>
      <tr>
        <td><code>hasLightDismiss</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether clicking outside dismisses the popover.</td>
      </tr>
      <tr>
        <td><code>hasEscapeDismiss</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether pressing Escape dismisses the popover.</td>
      </tr>
      <tr>
        <td><code>hasAutoFocus</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether to focus the first genuine content control when opened. A dialog with none falls back to the content container.</td>
      </tr>
      <tr>
        <td><code>closeButtonSelector</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Selector of the control that initial focus must skip, such as the component's own close button.</td>
      </tr>
      <tr>
        <td><code>dialogLabel</code></td>
        <td><code>string | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>Accessible label for the popover dialog. Provide one when there is no visible title.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>'dialog' | 'none' | MaybeRefOrGetter</code></td>
        <td><code>'dialog'</code></td>
        <td>ARIA role on the content container. Use <code>none</code> for listbox/menu popups whose own content role should be exposed and whose trigger keeps DOM focus.</td>
      </tr>
      <tr>
        <td><code>isModal</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether a dialog-role popover is modal (<code>aria-modal</code>).</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when the popover becomes visible.</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when the popover is hidden. Use this to return focus to the trigger when needed.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="usePopover returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the popover is currently open.</td>
      </tr>
      <tr>
        <td><code>triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Element that opens the popover. Bind it with <code>:ref</code>; the hook attaches the handlers and ARIA attributes.</td>
      </tr>
      <tr>
        <td><code>anchorRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Positioning anchor. Falls back to <code>triggerRef</code> when unset.</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Content container used by focus trapping and dismissal.</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>Unique ID for <code>aria-controls</code>.</td>
      </tr>
      <tr>
        <td><code>anchorId</code></td>
        <td><code>string</code></td>
        <td>CSS identifier for the anchor element, for advanced positioning cases.</td>
      </tr>
      <tr>
        <td><code>contentStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>Inline coordinates for the surface. Spread it on the content element's <code>style</code>.</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>Placement actually in effect, after flipping for available space.</td>
      </tr>
      <tr>
        <td><code>surfaceProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>Attributes for the content element: <code>id</code>, <code>role</code>, <code>aria-modal</code>, <code>aria-label</code>, <code>tabindex</code>.</td>
      </tr>
      <tr>
        <td><code>triggerProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>The ARIA attributes the hook writes onto <code>triggerRef</code>: <code>aria-haspopup</code>, <code>aria-expanded</code>, <code>aria-controls</code>.</td>
      </tr>
      <tr>
        <td><code>show</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Imperatively show the popover.</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Imperatively hide the popover.</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Toggle the popover open or closed.</td>
      </tr>
    </tbody>
  </table>
</div>

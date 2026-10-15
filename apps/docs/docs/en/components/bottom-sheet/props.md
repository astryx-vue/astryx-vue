---
layout: component-docs
title: Bottom Sheet
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="BottomSheet Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name for the sheet, and required. It is associated through <code>aria-label</code>; the panel has no built-in heading to derive a name from.</td>
      </tr>
      <tr>
        <td><code>v-model:isOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Controlled open state. Bound, the sheet renders exactly this value and Escape, a scrim click, or a swipe only asks for a change; unbound, the component owns its state.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>BottomSheetHeight | number | string</code></td>
        <td><code>'capped'</code></td>
        <td>How tall the sheet is. Named budgets are hug (fits content, up to 92% of the viewport), capped (about 62%), and tall (about 92%); a number is pixels and a string is used as a CSS length. Content taller than the visible panel scrolls inside it.</td>
      </tr>
      <tr>
        <td><code>snapPoints</code></td>
        <td><code>readonly BottomSheetSnapPoint[]</code></td>
        <td>-</td>
        <td>Extra heights the sheet can rest at when dragged. A number is a viewport fraction, <code>'50%'</code> a percentage, and <code>'320px'</code> an absolute height; the sheet's own height is always the tallest stop. Without it the sheet only opens and closes.</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>BottomSheetPadding</code></td>
        <td>-</td>
        <td>Inner padding of the content box using the spacing scale. When omitted, the theme decides, falling back to the <code>--spacing-4</code> step (16px) on every logical edge; pass <code>0</code> for a flush content box. The content box is a container, so a lone child that carries its own inset escapes the padding.</td>
      </tr>
      <tr>
        <td><code>purpose</code></td>
        <td><code>BottomSheetPurpose</code></td>
        <td><code>'info'</code></td>
        <td>Implicit dismissal, matching <code>Dialog</code>. info allows Escape, a scrim click, and a swipe; form allows Escape only; required blocks every implicit path and uses <code>alertdialog</code> semantics.</td>
      </tr>
      <tr>
        <td><code>hasScrim</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether to render a scrim and open modally. <code>true</code> uses <code>showModal()</code>: top layer, focus confinement, page scroll lock, and an inert background. <code>false</code> uses <code>show()</code>, leaving the page interactive and scrollable.</td>
      </tr>
      <tr>
        <td><code>finalFocusRef</code></td>
        <td><code>HTMLElement | null</code></td>
        <td><code>null</code></td>
        <td>Element that receives focus after the sheet closes, replacing the element that was focused when it opened. Use it when the opener can remount or the active element is not a reliable trigger.</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Renders the panel in the document flow instead of a <code>&lt;dialog&gt;</code>, without a scrim, focus trap, or motion. Used to preview the surface inside a container that is already inert, such as component documentation.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="BottomSheet Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The sheet content, rendered in the scrolling area below the grab handle.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events and template ref

<div class="component-api-table" role="region" aria-label="BottomSheet Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Emitted when the sheet asks to change state: Escape, a scrim click, a swipe dismissal, or a <code>v-model:isOpen</code> write.</td>
      </tr>
      <tr>
        <td><code>update:isOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Handled automatically by <code>v-model:isOpen</code>; you rarely need it directly.</td>
      </tr>
      <tr>
        <td><code>motionStart</code></td>
        <td><code>(motion: 'entering' | 'exiting') =&gt; void</code></td>
        <td>Emitted when an entrance or exit motion starts.</td>
      </tr>
      <tr>
        <td><code>motionComplete</code></td>
        <td><code>(motion: 'entering' | 'exiting') =&gt; void</code></td>
        <td>Emitted when the motion finishes. The exit completion is what closes the <code>&lt;dialog&gt;</code> and hands focus back.</td>
      </tr>
      <tr>
        <td><code>snap</code></td>
        <td><code>(visibleHeight: number) =&gt; void</code></td>
        <td>Emitted when a drag settles on a stop, with the sheet's visible height in pixels at that stop.</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLDivElement | null</code></td>
        <td>The panel element, exposed through a template ref. <code>class</code> and <code>style</code> land on this element.</td>
      </tr>
      <tr>
        <td><code>focus()</code> / <code>blur()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Moves focus into or out of the panel.</td>
      </tr>
    </tbody>
  </table>
</div>

## BottomSheetSwitcher

A multi-step flow shares one dialog. `v-model:active-sheet` names the child `BottomSheet` `sheetId` that is current. The scrim stays while the page changes, and the previous sheet remains briefly underneath so the heights can line up. Set `activeSheet` to `null` to close the flow.

<div class="component-api-table" role="region" aria-label="BottomSheetSwitcher props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>activeSheet</code></td><td><code>string | null</code></td><td><code>null</code></td><td>The current sheet's <code>sheetId</code>. Bind it with <code>v-model:active-sheet</code>.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>The current sheet's <code>label</code></td><td>Accessible name for the whole flow.</td></tr>
      <tr><td><code>purpose</code></td><td><code>BottomSheetPurpose</code></td><td>The current sheet's <code>purpose</code></td><td>How the whole flow can be dismissed.</td></tr>
      <tr><td><code>hasScrim</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the flow has one scrim. It stays up across pages.</td></tr>
    </tbody>
  </table>
</div>

A child `BottomSheet` with `sheetId` no longer opens its own dialog. The switcher decides which one is visible.

## Native attributes

The root element is the panel <code>&lt;div&gt;</code> (class <code>astryx-bottom-sheet</code>), wrapped in a fixed-position <code>&lt;dialog&gt;</code>.

The following are passed to the panel element:

- HTML attributes.
- <code>aria-*</code> attributes, except <code>aria-label</code> and <code>aria-labelledby</code>, which name the dialog around it.
- <code>data-*</code> attributes.
- <code>class</code>.
- <code>style</code>.

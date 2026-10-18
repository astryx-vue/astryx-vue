---
layout: component-docs
title: useContainerReveal
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useContainerReveal parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseContainerRevealOptions</code></td>
        <td><code>{}</code></td>
        <td>Configuration object for the reveal container. Optional.</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>true</code></td>
        <td>When false the hook is inert: the container gets no classes and the content getters return nothing, so content is always shown. Read on every call, so a component can flip it after mount (e.g. <code>revealOn === "hover"</code>).</td>
      </tr>
      <tr>
        <td><code>containerProps(options?).hoverDelay</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>Milliseconds the pointer must dwell before the reveal starts: a hover-intent gate like Tooltip's and HoverCard's delay, so a cursor sweeping across a list leaves nothing painted behind it. Keyboard and coarse pointers never wait.</td>
      </tr>
      <tr>
        <td><code>containerProps(options?).forceState</code></td>
        <td><code>'active' | 'inactive'</code></td>
        <td>—</td>
        <td>Pins the trigger state when the caller owns it: a motion gate, a scroll, or a row whose menu is open. <code>'inactive'</code> still yields to keyboard focus and coarse pointers.</td>
      </tr>
      <tr>
        <td><code>contentProps(options?).isRevealInverted</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Conceal on hover instead of reveal on hover. Pointer only; keyboard focus and touch still show the content.</td>
      </tr>
      <tr>
        <td><code>contentProps(options?).isLayoutPreserved</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Reserves the layout box while hidden (opacity only) and avoids layout shift.</td>
      </tr>
      <tr>
        <td><code>contentProps(options?).forceVisibility</code></td>
        <td><code>'shown' | 'hidden'</code></td>
        <td>—</td>
        <td>Pins this one element's appearance whatever the container is doing. <code>'hidden'</code> yields to focus.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useContainerReveal return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerProps</code></td>
        <td><code>(options?: ContainerRevealOptions) =&gt; { class?: string | Record&lt;string, boolean&gt;, style?: CSSProperties }</code></td>
        <td>Bind onto the container whose hover and focus-within drive the reveal. Accepts <code>hoverDelay</code> and <code>forceState</code>. Returns an empty object when the hook is disabled.</td>
      </tr>
      <tr>
        <td><code>contentProps</code></td>
        <td><code>(options?: ContentRevealOptions) =&gt; { class?: string | Record&lt;string, boolean&gt; }</code></td>
        <td>Bind onto each revealed or concealed child. Accepts <code>isRevealInverted</code>, <code>isLayoutPreserved</code>, and <code>forceVisibility</code>. Returns an empty object when the hook is disabled.</td>
      </tr>
    </tbody>
  </table>
</div>

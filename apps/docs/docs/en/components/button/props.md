---
layout: component-docs
title: Button
outline: false
footer: false
---

## Button Props

<div class="component-api-table" role="region" aria-label="Button Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>required</td><td>Names the action and becomes visible text when no default slot is present.</td></tr>
      <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'ghost' | 'destructive'</code></td><td><code>'secondary'</code></td><td>Visual hierarchy and semantic variant.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size.</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>Resting shadow depth for a standalone floating button; ButtonGroup owns it inside a group.</td></tr>
      <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>Native button type.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form submission name.</td></tr>
      <tr><td><code>value</code></td><td><code>string | number | readonly string[]</code></td><td>—</td><td>Form submission value.</td></tr>
      <tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>ID of the associated form.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables interaction. A tooltip switches this to aria-disabled so focus remains available.</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows loading state, sets aria-busy, and disables non-interruptible activation.</td></tr>
      <tr><td><code>isInterruptible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows clickAction to run again while earlier work is pending.</td></tr>
      <tr><td><code>clickAction</code></td><td><code>(event: MouseEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Action function that automatically drives pending state.</td></tr>
      <tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows only the icon slot and uses label to name the button.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Button width. Numbers become pixels; CSS strings are used as supplied.</td></tr>
      <tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>Localized text used by the spinner and live region.</td></tr>
      <tr><td><code>tooltip</code></td><td><code>string</code></td><td>—</td><td>Supplementary hint shown on hover and keyboard focus.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Renders the enabled root as a link when present.</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'a'</code></td><td>Custom Vue link component for href mode. It receives both href and to.</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>Link browsing context.</td></tr>
      <tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link relationship attribute.</td></tr>
    </tbody>
  </table>
</div>

## Async actions

- `@click` runs before `clickAction`.
- If `@click` calls `event.preventDefault()`, the component skips `clickAction`.
- If `clickAction` returns a Promise, the component enters the loading state.
- When the Promise fulfills or rejects, the component clears the loading state.
- The application must catch errors inside `clickAction`.

### Repeated activation

- If `isInterruptible` is `false`, loading blocks another activation.
- If `isInterruptible` is `true`, loading permits another activation.
- Repeated activation runs multiple actions concurrently.
- The component does not cancel earlier Promises.

To cancel an earlier network request, call `AbortController.abort()` in the application.

## Button Slots

<div class="component-api-table" role="region" aria-label="Button slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Optional visible-content override. label remains the stable accessible name.</td></tr>
      <tr><td><code>icon</code></td><td>Decorative icon before the label.</td></tr>
      <tr><td><code>end</code></td><td>Short trailing decoration such as a badge or icon. Ignored in icon-only mode.</td></tr>
    </tbody>
  </table>
</div>

## Button Events

<div class="component-api-table" role="region" aria-label="Button events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>Cancellable Vue component event. It is not emitted while disabled, non-interruptible loading, or deduplicated.</td></tr>
    </tbody>
  </table>
</div>

## Template ref

`Button` exposes `element`.
Its type is `HTMLButtonElement | HTMLAnchorElement | HTMLElement | null`.

## Native attributes

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

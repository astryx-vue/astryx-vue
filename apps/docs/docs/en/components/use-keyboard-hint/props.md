---
layout: component-docs
title: useKeyboardHint
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useKeyboardHint parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseKeyboardHintOptions</code></td>
        <td><code>{}</code></td>
        <td>Configuration object for the keyboard hint. Optional.</td>
      </tr>
      <tr>
        <td><code>options.orientation</code></td>
        <td><code>'horizontal' | 'vertical' | 'both'</code></td>
        <td><code>'horizontal'</code></td>
        <td>Which arrow-key axis the composite navigates, controlling which arrow icons the hint shows (← → for horizontal, ↑ ↓ for vertical, all four for both).</td>
      </tr>
      <tr>
        <td><code>options.dismissAfterMs</code></td>
        <td><code>number</code></td>
        <td><code>3000</code></td>
        <td>Milliseconds before the hint auto-dismisses after appearing.</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the hint is enabled. Set to false to suppress it for a specific instance (e.g. a disabled or read-only widget).</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useKeyboardHint return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Hint</code></td>
        <td><code>Component</code></td>
        <td>The hint element to render inside the composite container as the last child, e.g. <code>&lt;component :is="hint.Hint" /&gt;</code>. It positions itself <code>fixed</code>, renders arrow keys with <code>Kbd</code>, and manages its own visibility. Render it unconditionally.</td>
      </tr>
      <tr>
        <td><code>visible</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the hint is currently shown. <code>Hint</code> reads it; a custom hint element can too.</td>
      </tr>
      <tr>
        <td><code>anchor</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>The focused item the hint is anchored to. <code>null</code> before the first show.</td>
      </tr>
      <tr>
        <td><code>orientation</code></td>
        <td><code>ComputedRef&lt;KeyboardHintOrientation&gt;</code></td>
        <td>The resolved orientation, with the default applied.</td>
      </tr>
      <tr>
        <td><code>onFocus</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>Bind to the container's <code>focusin</code> (<code>@focusin</code>), because focus does not bubble. Shows the hint on the first keyboard-focus (<code>:focus-visible</code>) entry from outside the composite.</td>
      </tr>
      <tr>
        <td><code>onBlur</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>Bind to the container's <code>focusout</code> (<code>@focusout</code>). Hides the hint when focus leaves the composite entirely, and re-anchors when focus moves within.</td>
      </tr>
      <tr>
        <td><code>onKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>Bind to the container's <code>keydown</code>. Dismisses the hint on the first arrow press (the user has discovered the interaction). Never prevents default or stops propagation.</td>
      </tr>
    </tbody>
  </table>
</div>

---
layout: component-docs
title: useStreamingText
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useStreamingText Parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>targetText</code></td>
        <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
        <td>—</td>
        <td>The full target text to reveal. As new chunks arrive, update this value with the accumulated text.</td>
      </tr>
      <tr>
        <td><code>isStreaming</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>Whether text is currently being streamed. When false, the hook returns the full <code>targetText</code> immediately.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseStreamingTextOptions&gt;</code></td>
        <td>—</td>
        <td>Optional configuration for streaming behavior.</td>
      </tr>
      <tr>
        <td><code>options.speed</code></td>
        <td><code>'natural' | 'fast' | 'instant'</code></td>
        <td><code>'natural'</code></td>
        <td>Speed preset for text reveal. <code>natural</code> reveals a short run at each motion tick, <code>fast</code> ticks twice as often so it drains the backlog sooner, and <code>instant</code> returns the full text with no animation.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useStreamingText Returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>displayedText</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>The portion of <code>targetText</code> to render. Grows steadily toward the full <code>targetText</code> during streaming, or equals <code>targetText</code> when not streaming.</td>
      </tr>
    </tbody>
  </table>
</div>

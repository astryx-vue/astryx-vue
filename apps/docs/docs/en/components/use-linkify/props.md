---
layout: component-docs
title: useLinkify
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useLinkify parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>text</code></td>
        <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
        <td>—</td>
        <td>The plain text to scan. Empty text gives one text segment of itself.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseLinkifyOptions&gt;</code></td>
        <td>—</td>
        <td>Configuration object.</td>
      </tr>
      <tr>
        <td><code>options.patterns</code></td>
        <td><code>LinkifyPattern[]</code></td>
        <td>—</td>
        <td>Custom patterns, in addition to (or, with <code>hasBuiltins</code> false, instead of) the built-in URL and email detection. Each has a global-flag regex <code>pattern</code>, an <code>href(match)</code> builder, an optional <code>label(match)</code> and an optional <code>isExternal</code> (default <code>false</code>).</td>
      </tr>
      <tr>
        <td><code>options.hasBuiltins</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Include the built-in http(s) URL and email detection. Set it to <code>false</code> when <code>patterns</code> should define everything that links.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useLinkify returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>(return value)</td>
        <td><code>ComputedRef&lt;LinkifySegment[]&gt;</code></td>
        <td>The text as an ordered list of <code>{ type: 'text', text }</code> and <code>{ type: 'link', text, href, isExternal }</code> segments. It follows the text and options it was given.</td>
      </tr>
    </tbody>
  </table>
</div>
